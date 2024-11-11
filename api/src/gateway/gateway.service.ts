import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SMSType } from './sms-type.emum';
import { AuthService } from '../auth/auth.service';
import { ReceivedSMSDTO, RegisterDeviceInputDTO, SendSMSInputDTO } from './gateway.dto';

@Injectable()
export class GatewayService {
  private db: admin.database.Database;

  constructor(private authService: AuthService) {
    this.db = admin.database();
  }

  async getStatsForUser(user: any) {
    const devices = await this.getDevicesForUser(user);
    const totalDevices = devices.length;

    // Get all SMS batches for user's devices
    const deviceIds = devices.map(device => device.id);
    const smsBatchesRef = this.db.ref('smsBatches');
    const sentSMSSnapshot = await smsBatchesRef
        .orderByChild('deviceId')
        .once('value');
    
    let totalSentSMS = 0;
    sentSMSSnapshot.forEach(child => {
        const batch = child.val();
        if (deviceIds.includes(batch.deviceId)) {
            totalSentSMS += batch.recipientCount || 0;
        }
    });

    // Get received SMS count
    const totalReceivedSMS = devices.reduce((acc, device) => 
        acc + (device.receivedSMSCount || 0), 0);

    return {
        totalDevices,
        totalSentSMS,
        totalReceivedSMS,
    };
}


  // Register a new device for a user
  async registerDevice(input: RegisterDeviceInputDTO, user: any) {
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

  // Get device by ID
  async getDeviceById(deviceId: string) {
    const snapshot = await this.db.ref(`devices/${deviceId}`).once('value');
    return snapshot.exists() ? { id: deviceId, ...snapshot.val() } : null;
  }

  // Get all devices for a specific user
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

  // Update device information
  async updateDevice(deviceId: string, input: RegisterDeviceInputDTO) {
    const device = await this.getDeviceById(deviceId);
    if (!device) {
      throw new HttpException({ error: 'Device not found' }, HttpStatus.NOT_FOUND);
    }

    const updates = {
      ...device,
      ...input,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    };

    await this.db.ref(`devices/${deviceId}`).update(updates);
    return { id: deviceId, ...updates };
  }

  // Delete a device
  async deleteDevice(deviceId: string) {
    const device = await this.getDeviceById(deviceId);
    if (!device) {
      throw new HttpException({ error: 'Device not found' }, HttpStatus.NOT_FOUND);
    }

    await this.db.ref(`devices/${deviceId}`).remove();
    return { success: true };
  }

  // Send SMS through a device
  async sendSMS(deviceId: string, smsData: SendSMSInputDTO) {
    const device = await this.getDeviceById(deviceId);
    if (!device?.enabled) {
      throw new HttpException(
        { error: 'Device not found or disabled' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create a new SMS batch
    const batchRef = this.db.ref('smsBatches').push();
    const batch = {
      deviceId,
      message: smsData.message,
      recipientCount: smsData.recipients.length,
      recipientPreview: this.getRecipientsPreview(smsData.recipients),
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    await batchRef.set(batch);

    // Create individual SMS entries for each recipient
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

    // Send FCM notification to device
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

  // Handle received SMS from device
  async receiveSMS(deviceId: string, dto: ReceivedSMSDTO) {
    const device = await this.getDeviceById(deviceId);
    if (!device) {
      throw new HttpException({ error: 'Device not found' }, HttpStatus.NOT_FOUND);
    }

    const smsRef = this.db.ref('sms').push();
    const sms = {
      deviceId,
      message: dto.message,
      sender: dto.sender,
      type: SMSType.RECEIVED,
      receivedAt: dto.receivedAt || admin.database.ServerValue.TIMESTAMP,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    await smsRef.set(sms);
    await this.db.ref(`devices/${deviceId}`).update({
      receivedSMSCount: (device.receivedSMSCount || 0) + 1,
    });

    return { id: smsRef.key, ...sms };
  }

  // Get all received SMS for a device
  async getReceivedSMS(deviceId: string) {
    const snapshot = await this.db.ref('sms')
      .orderByChild('deviceId')
      .equalTo(deviceId)
      .once('value');

    const messages = [];
    snapshot.forEach(child => {
      const sms = child.val();
      if (sms.type === SMSType.RECEIVED) {
        messages.push({ id: child.key, ...sms });
      }
    });

    return messages;
  }

  // Helper function to create a preview of recipients
  private getRecipientsPreview(recipients: string[]): string {
    if (recipients.length <= 2) return recipients.join(' and ');
    return `${recipients[0]}, ${recipients[1]}, and ${recipients.length - 2} others`;
  }
}
