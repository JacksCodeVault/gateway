import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class CanModifyApiKey implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyId = request.params.id;
    const userId = request.user?.id;

    if (!apiKeyId || !userId) {
      throw new HttpException({ error: 'Invalid request' }, HttpStatus.BAD_REQUEST);
    }

    const apiKeySnapshot = await admin.database().ref(`apiKeys/${apiKeyId}`).once('value');
    if (!apiKeySnapshot.exists()) {
      throw new HttpException({ error: 'API key not found' }, HttpStatus.NOT_FOUND);
    }

    const apiKey = apiKeySnapshot.val();
    if (apiKey.userId === userId || request.user?.role === 'admin') {
      return true;
    }

    throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
  }
}
