import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterInputDTO {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginInputDTO {
  @ApiProperty({ type: String, required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDTO {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class ResetPasswordDTO {
  @ApiProperty({ type: String, required: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class DeleteAccountDTO {
  @ApiProperty({ type: String, required: true, description: 'Current password to confirm deletion' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ApiKeyDTO {
  @ApiProperty({ type: String })
  @IsString()
  key: string;

  @ApiProperty({ type: String })
  @IsString()
  userId: string;

  @ApiProperty({ type: Number })
  usageCount: number;

  @ApiProperty({ type: String })
  lastUsedAt: string;
}

export class ApiKeyResponseDTO {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  key: string;

  @ApiProperty({ type: String })
  userId: string;

  @ApiProperty({ type: Number })
  usageCount: number;

  @ApiProperty({ type: Date })
  lastUsedAt: Date;

  @ApiProperty({ type: Date })
  createdAt: Date;
}
