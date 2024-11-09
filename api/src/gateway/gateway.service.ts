import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SMSType } from './sms-type.emum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class GatewayService {
  private db: admin.database.Database;

  constructor(private authService: AuthService) {
    this.db = admin.database();
  }

  async registerDevice(input: any, user: any) {
    const deviceRef = this.db.ref('devices').push();
    const device = {
      userId: user.id,
      ...input,
      sentSMSCount: 0,
      receivedSMSCount: 0,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    await deviceRef.set(device);
    return { id: deviceRef.key, ...device };
  }

  async getDeviceById(deviceId: string) {
    const snapshot = await this.db.ref(`devices/${deviceId}`).once('value');
    return snapshot.exists() ? { id: deviceId, ...snapshot.val() } : null;
  }

  async getDevicesForUser(user: any) {
    const snapshot = await this.db.ref('devices')
      .orderByChild('userId')
      .equalTo(user.id)
      .once('value');
    
    const devices = [];
    snapshot.forEach(child => {
      devices.push({ id: child.key, ...child.val() });
    });
    return devices;
  }

  async sendSMS(deviceId: string, smsData: any) {
    const device = await this.getDeviceById(deviceId);
    if (!device?.enabled) {
      throw new HttpException(
        { error: 'Device not found or disabled' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const batchRef = this.db.ref('smsBatches').push();
    const batch = {
      deviceId,
      message: smsData.message,
      recipientCount: smsData.recipients.length,
      recipientPreview: this.getRecipientsPreview(smsData.recipients),
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    await batchRef.set(batch);

    const smsPromises = smsData.recipients.map(recipient => {
      const smsRef = this.db.ref('sms').push();
      return smsRef.set({
        deviceId,
        batchId: batchRef.key,
        message: smsData.message,
        type: SMSType.SENT,
        recipient,
        requestedAt: admin.database.ServerValue.TIMESTAMP,
      });
    });

    await Promise.all(smsPromises);

    // Send FCM message to device
    const message = {
      data: {
        type: 'SMS_REQUEST',
        smsData: JSON.stringify({
          batchId: batchRef.key,
          message: smsData.message,
          recipients: smsData.recipients,
        }),
      },
      token: device.fcmToken,
    };

    try {
      await admin.messaging().send(message);
      return { success: true, batchId: batchRef.key };
    } catch (error) {
      throw new HttpException(
        { error: 'Failed to send SMS request to device' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getRecipientsPreview(recipients: string[]): string {
    if (recipients.length <= 2) return recipients.join(' and ');
    return `${recipients[0]}, ${recipients[1]}, and ${recipients.length - 2} others`;
  }
}
