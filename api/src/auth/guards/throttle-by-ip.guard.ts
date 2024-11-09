import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as admin from 'firebase-admin';

@Injectable()
export class ThrottlerByIpGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const ip = this.extractIP(req);
    const timestamp = Date.now();
    
    await admin.database().ref('throttle').child(ip).set({
      lastAccess: timestamp,
      count: admin.database.ServerValue.increment(1)
    });
    
    return ip;
  }

  private extractIP(req: Record<string, any>): string {
    return req.headers['x-forwarded-for'] || 
           (req.ips.length ? req.ips[0] : req.ip);
  }
}
