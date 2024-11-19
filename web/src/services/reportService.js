import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { reportsAPI } from '@/lib/api';

const reportService = {
  getMessageReport: async (filters) => {
    const response = await reportsAPI.getMessageReport(filters);
    return response.data;
  },

  getDeviceReport: async (filters) => {
    const response = await reportsAPI.getDeviceReport(filters);
    return response.data;
  },

  generatePDFReport: async (data) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('SMS Gateway Report', 20, 20);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 30);

    // Message Statistics
    doc.setFontSize(16);
    doc.text('Message Statistics', 20, 45);
    doc.setFontSize(12);
    doc.text(`Total Messages: ${data.totalMessages}`, 25, 55);
    doc.text(`Delivery Rate: ${data.deliveryRate?.toFixed(2)}%`, 25, 65);

    // Messages by Date
    doc.setFontSize(16);
    doc.text('Daily Message Volume', 20, 85);
    doc.setFontSize(12);
    let yPosition = 95;
    Object.entries(data.messagesByDate).forEach(([date, count]) => {
      doc.text(`${format(new Date(date), 'PP')}: ${count} messages`, 25, yPosition);
      yPosition += 10;
    });

    // Messages by Device
    doc.setFontSize(16);
    doc.text('Device Message Distribution', 20, yPosition + 20);
    doc.setFontSize(12);
    yPosition += 30;
    Object.entries(data.messagesByDevice).forEach(([deviceId, count]) => {
      doc.text(`Device ${deviceId}: ${count} messages`, 25, yPosition);
      yPosition += 10;
    });

    return doc;
  },

  downloadPDFReport: async (filters) => {
    try {
      const reportData = await reportService.getMessageReport(filters);
      const doc = await reportService.generatePDFReport(reportData);
      const fileName = `sms-report-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`;
      doc.save(fileName);
      return true;
    } catch (error) {
      console.error('Error generating report:', error);
      return false;
    }
  },

  exportCSV: async (filters) => {
    try {
      const response = await reportsAPI.exportReport(filters);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sms-report-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`;
      link.click();
      return true;
    } catch (error) {
      console.error('Error exporting CSV:', error);
      return false;
    }
  }
};

export default reportService;
