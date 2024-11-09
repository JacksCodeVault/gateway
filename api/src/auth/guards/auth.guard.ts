import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let userId;

    const apiKeyString = request.headers['x-api-key'] || request.query.apiKey;
    if (request.headers.authorization?.startsWith('Bearer ')) {
      const bearerToken = request.headers.authorization.split(' ')[1];
      try {
        const payload = this.jwtService.verify(bearerToken);
        userId = payload.sub;
      } catch (e) {
        throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
      }
    } else if (apiKeyString) {
      const apiKey = await this.authService.validateApiKey(apiKeyString);
      if (apiKey) {
        userId = apiKey.userId;
        request.apiKey = apiKey;
      }
    }

    if (userId) {
      const userSnapshot = await admin.database().ref(`users/${userId}`).once('value');
      if (userSnapshot.exists()) {
        request.user = { id: userId, ...userSnapshot.val() };
        return true;
      }
    }

    throw new HttpException({ error: 'Unauthorized' }, HttpStatus.UNAUTHORIZED);
  }
}
