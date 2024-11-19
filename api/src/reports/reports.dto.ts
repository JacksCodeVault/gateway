import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsNumber } from 'class-validator';

export class ReportFiltersDTO {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  deviceId?: string;
}

export class MessageReportDTO {
  @ApiProperty()
  @IsNumber()
  totalMessages: number;

  @ApiProperty()
  @IsNumber()
  deliveryRate: number;

  @ApiProperty({
    type: 'object',
    properties: {
      date: { type: 'number' }
    },
    additionalProperties: true
  })
  messagesByDate: Record<string, number>;

  @ApiProperty({
    type: 'object',
    properties: {
      deviceId: { type: 'number' }
    },
    additionalProperties: true
  })
  messagesByDevice: Record<string, number>;
}

export class DeviceReportDTO {
  @ApiProperty()
  @IsNumber()
  totalDevices: number;

  @ApiProperty()
  @IsNumber()
  activeDevices: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        messageCount: { type: 'number' },
        successRate: { type: 'number' }
      }
    }
  })
  devicePerformance: any[];
}
