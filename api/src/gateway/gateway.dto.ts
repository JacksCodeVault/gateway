import { ApiProperty } from '@nestjs/swagger';

export class RegisterDeviceInputDTO {
  @ApiProperty({ type: Boolean })
  enabled?: boolean;

  @ApiProperty({ type: String })
  fcmToken?: string;

  @ApiProperty({ type: String })
  brand?: string;

  @ApiProperty({ type: String })
  model?: string;

  @ApiProperty({ type: String })
  buildId?: string;

  @ApiProperty({ type: String })
  osVersion?: string;
}

export class SendSMSInputDTO {
  @ApiProperty({ type: String, required: true })
  message: string;

  @ApiProperty({ type: [String], required: true })
  recipients: string[];
}

export class ReceivedSMSDTO {
  @ApiProperty({ type: String, required: true })
  message: string;

  @ApiProperty({ type: String, required: true })
  sender: string;

  @ApiProperty({ type: Number, required: true })
  receivedAtInMillis: number;
}
