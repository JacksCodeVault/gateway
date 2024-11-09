import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanModifyDevice } from './guards/can-modify-device.guard';
import { GatewayService } from './gateway.service';
import { RegisterDeviceInputDTO, SendSMSInputDTO, ReceivedSMSDTO } from './gateway.dto';

@ApiTags('gateway')
@Controller('gateway')
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('/devices')
  async registerDevice(@Body() input: RegisterDeviceInputDTO, @Request() req) {
    const data = await this.gatewayService.registerDevice(input, req.user);
    return { data };
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('/devices')
  async getDevices(@Request() req) {
    const data = await this.gatewayService.getDevicesForUser(req.user);
    return { data };
  }

  @UseGuards(AuthGuard, CanModifyDevice)
  @ApiBearerAuth()
  @Post('/devices/:id/sendSMS')
  async sendSMS(@Param('id') deviceId: string, @Body() input: SendSMSInputDTO) {
    const data = await this.gatewayService.sendSMS(deviceId, input);
    return { data };
  }
}
