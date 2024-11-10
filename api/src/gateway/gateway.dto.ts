import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsString, IsNumber, IsArray, IsOptional, IsDateString } from 'class-validator'

export class RegisterDeviceInputDTO {
  @ApiProperty({ type: Boolean, description: 'Device enabled status' })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean

  @ApiProperty({ type: String, description: 'Firebase Cloud Messaging token' })
  @IsString()
  @IsOptional()
  fcmToken?: string

  @ApiProperty({ type: String, description: 'Device brand name' })
  @IsString()
  @IsOptional()
  brand?: string

  @ApiProperty({ type: String, description: 'Device manufacturer' })
  @IsString()
  @IsOptional()
  manufacturer?: string

  @ApiProperty({ type: String, description: 'Device model' })
  @IsString()
  @IsOptional()
  model?: string

  @ApiProperty({ type: String, description: 'Device serial number' })
  @IsString()
  @IsOptional()
  serial?: string

  @ApiProperty({ type: String, description: 'Device build ID' })
  @IsString()
  @IsOptional()
  buildId?: string

  @ApiProperty({ type: String, description: 'Operating system' })
  @IsString()
  @IsOptional()
  os?: string

  @ApiProperty({ type: String, description: 'OS version' })
  @IsString()
  @IsOptional()
  osVersion?: string

  @ApiProperty({ type: String, description: 'App version name' })
  @IsString()
  @IsOptional()
  appVersionName?: string

  @ApiProperty({ type: Number, description: 'App version code' })
  @IsNumber()
  @IsOptional()
  appVersionCode?: number
}

export class SMSData {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The message to send',
  })
  @IsString()
  message: string

  @ApiProperty({
    type: [String],
    required: true,
    description: 'List of phone numbers to send the SMS to',
    example: ['+2519xxxxxxxx', '+2517xxxxxxxx'],
  })
  @IsArray()
  @IsString({ each: true })
  recipients: string[]

  @ApiProperty({
    type: String,
    required: false,
    description: '(Legacy) Will be replaced with `message` field',
  })
  @IsString()
  @IsOptional()
  smsBody?: string

  @ApiProperty({
    type: [String],
    required: false,
    description: '(Legacy) Will be replaced with `recipients` field',
    example: ['+254xxxxxxxx', '+2547xxxxxxxx'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  receivers?: string[]
}

export class SendSMSInputDTO extends SMSData {}

export class ReceivedSMSDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The message received',
  })
  message: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'The phone number of the sender',
  })
  sender: string;

  @ApiProperty({
    type: Date,
    required: false,
    description: 'The time the message was received',
  })
  receivedAt?: Date;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'The time the message was created in milliseconds',
  })
  receivedAtInMillis?: number;
}


export class DeviceDTO {
  @ApiProperty({ type: String })
  @IsString()
  _id: string

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  enabled: boolean

  @ApiProperty({ type: String })
  @IsString()
  brand: string

  @ApiProperty({ type: String })
  @IsString()
  manufacturer: string

  @ApiProperty({ type: String })
  @IsString()
  model: string

  @ApiProperty({ type: String })
  @IsString()
  buildId: string
}

export class RetrieveSMSDTO {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The id of the received SMS',
  })
  @IsString()
  _id: string

  @ApiProperty({
    type: String,
    required: true,
    description: 'The message received',
  })
  @IsString()
  message: string

  @ApiProperty({
    type: DeviceDTO,
    required: true,
    description: 'The device that received the message',
  })
  device: DeviceDTO

  @ApiProperty({
    type: String,
    required: true,
    description: 'The phone number of the sender',
  })
  @IsString()
  sender: string

  @ApiProperty({
    type: Date,
    required: true,
    description: 'The time the message was received',
  })
  @IsDateString()
  receivedAt: Date

  @ApiProperty({
    type: Date,
    required: true,
    description: 'The time the message was created',
  })
  @IsDateString()
  createdAt: Date

  @ApiProperty({
    type: Date,
    required: true,
    description: 'The time the message was last updated',
  })
  @IsDateString()
  updatedAt: Date
}

export class RetrieveSMSResponseDTO {
  @ApiProperty({
    type: [RetrieveSMSDTO],
    required: true,
    description: 'The received SMS data',
  })
  @IsArray()
  data: RetrieveSMSDTO[]
}

export class StatsResponseDTO {
  @ApiProperty({ type: Number, description: 'Total number of devices' })
  @IsNumber()
  totalDevices: number

  @ApiProperty({ type: Number, description: 'Total number of sent SMS' })
  @IsNumber()
  totalSentSMS: number

  @ApiProperty({ type: Number, description: 'Total number of received SMS' })
  @IsNumber()
  totalReceivedSMS: number
}
