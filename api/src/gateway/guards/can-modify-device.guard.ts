import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GatewayService } from '../gateway.service';
import * as admin from 'firebase-admin';

@Injectable()
export class CanModifyDevice implements CanActivate {
  constructor(private gatewayService: GatewayService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const deviceId = request.params.id;
    const userId = request.user?.id;

    if (!deviceId || !userId) {
      throw new HttpException({ error: 'Invalid device id' }, HttpStatus.BAD_REQUEST);
    }

    const device = await this.gatewayService.getDeviceById(deviceId);
    if (device?.userId === userId || request.user?.role === 'admin') {
      return true;
    }

    throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
  }
}
