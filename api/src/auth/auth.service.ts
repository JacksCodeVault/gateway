import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private db: admin.database.Database;

  constructor(private jwtService: JwtService) {
    this.db = admin.database();
  }

  async register(userData: any) {
    const userRef = this.db.ref('users');
    const snapshot = await userRef.orderByChild('email').equalTo(userData.email).once('value');
    
    if (snapshot.exists()) {
      throw new HttpException({ error: 'User already exists' }, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    const newUserRef = userRef.push();
    await newUserRef.set(newUser);

    const payload = { email: userData.email, sub: newUserRef.key };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: newUserRef.key, ...newUser },
    };
  }

  async login(userData: any) {
    const userRef = this.db.ref('users');
    const snapshot = await userRef.orderByChild('email').equalTo(userData.email).once('value');
    
    if (!snapshot.exists()) {
      throw new HttpException({ error: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);
    }

    const userKey = Object.keys(snapshot.val())[0];
    const user = snapshot.val()[userKey];

    if (!(await bcrypt.compare(userData.password, user.password))) {
      throw new HttpException({ error: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, sub: userKey };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: userKey, ...user },
    };
  }

  async generateApiKey(userId: string) {
    const apiKey = uuidv4();
    const hashedApiKey = await bcrypt.hash(apiKey, 10);

    const apiKeyRef = this.db.ref('apiKeys').push();
    await apiKeyRef.set({
      key: apiKey.substr(0, 17) + '*'.repeat(18),
      hashedKey: hashedApiKey,
      userId,
      usageCount: 0,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    });

    return { apiKey, message: 'Save this key, it won\'t be shown again' };
  }

  async validateApiKey(apiKeyString: string) {
    const apiKeysRef = this.db.ref('apiKeys');
    const snapshot = await apiKeysRef.orderByChild('key').startAt(apiKeyString.substr(0, 17)).endAt(apiKeyString.substr(0, 17) + '\uf8ff').once('value');
    
    if (!snapshot.exists()) {
      return null;
    }

    const apiKeys = snapshot.val();
    for (const key in apiKeys) {
      const apiKey = apiKeys[key];
      if (await bcrypt.compare(apiKeyString, apiKey.hashedKey)) {
        return { id: key, ...apiKey };
      }
    }
    return null;
  }
}
