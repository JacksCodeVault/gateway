import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userSnapshot = await admin.database().ref(`users/${payload.sub}`).once('value');
    if (!userSnapshot.exists()) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return { id: payload.sub, ...userSnapshot.val() };
  }
}
