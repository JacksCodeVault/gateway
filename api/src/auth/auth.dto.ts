import { ApiProperty } from '@nestjs/swagger';

export class RegisterInputDTO {
  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: String, required: true })
  password: string;
}

export class LoginInputDTO {
  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: String, required: true })
  password: string;
}

export class ApiKeyDTO {
  @ApiProperty({ type: String })
  key: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: Number })
  usageCount: number;

  @ApiProperty({ type: String })
  lastUsedAt: string;
}
