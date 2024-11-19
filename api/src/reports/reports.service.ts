import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ReportFiltersDTO, MessageReportDTO, DeviceReportDTO } from './reports.dto';

@Injectable()
export class ReportsService {
  private db: admin.database.Database;

  constructor() {
    this.db = admin.database();
  }

  async getMessageReport(filters: ReportFiltersDTO, userId: string): Promise<MessageReportDTO> {
    const userDevices = await this.getUserDevices(userId);
    const userDeviceIds = userDevices.map(device => device.id);

    const messagesRef = this.db.ref('forwardedMessages');
    const snapshot = await messagesRef.once('value');

    const messages = [];
    let totalCount = 0;
    let successCount = 0;

    snapshot.forEach(child => {
      const message = child.val();
      if (userDeviceIds.includes(message.deviceId)) {
        messages.push({
          id: child.key,
          ...message
        });
        totalCount++;
        if (message.status === 'delivered') successCount++;
      }
    });

    return {
      totalMessages: totalCount,
      deliveryRate: totalCount > 0 ? (successCount / totalCount) * 100 : 0,
      messagesByDate: this.groupMessagesByDate(messages),
      messagesByDevice: this.groupMessagesByDevice(messages)
    };
  }

  async getDeviceReport(filters: ReportFiltersDTO, userId: string): Promise<DeviceReportDTO> {
    const devices = await this.getUserDevices(userId);
    
    const devicePerformance = devices.map(device => ({
      id: device.id,
      ...device,
      messageCount: device.sentSMSCount || 0,
      successRate: ((device.deliveredCount || 0) / (device.sentSMSCount || 1)) * 100
    }));

    return {
      totalDevices: devices.length,
      activeDevices: devices.filter(d => d.enabled).length,
      devicePerformance
    };
  }

  async generateExport(filters: ReportFiltersDTO, userId: string) {
    const messages = await this.getMessageReport(filters, userId);
    return this.convertToCSV(messages);
  }

  private async getUserDevices(userId: string) {
    const devicesRef = this.db.ref('devices');
    const snapshot = await devicesRef
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');

    const devices = [];
    snapshot.forEach(child => {
      devices.push({
        id: child.key,
        ...child.val()
      });
    });
    return devices;
  }

  private groupMessagesByDate(messages: any[]) {
    return messages.reduce((acc, message) => {
      const date = new Date(message.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  }

  private groupMessagesByDevice(messages: any[]) {
    return messages.reduce((acc, message) => {
      acc[message.deviceId] = (acc[message.deviceId] || 0) + 1;
      return acc;
    }, {});
  }

  private convertToCSV(data: any) {
    const headers = ['Date', 'Message Count', 'Success Rate'];
    const rows = Object.entries(data.messagesByDate).map(([date, count]) => [
      date,
      count,
      data.deliveryRate.toFixed(2)
    ]);
    
    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  }
}
