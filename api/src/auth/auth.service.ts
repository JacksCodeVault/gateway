import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { DeleteAccountDTO, RegisterInputDTO, LoginInputDTO, ChangePasswordDTO, ResetPasswordDTO } from './auth.dto';

@Injectable()
export class AuthService {
  private db: admin.database.Database;

  constructor(private jwtService: JwtService) {
    this.db = admin.database();
  }

  async register(userData: RegisterInputDTO) {
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

  async login(userData: LoginInputDTO) {
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

  async changePassword(data: ChangePasswordDTO, userId: string) {
    const userRef = this.db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    const user = snapshot.val();

    if (!(await bcrypt.compare(data.currentPassword, user.password))) {
      throw new HttpException({ error: 'Current password is incorrect' }, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await userRef.update({ 
      password: hashedPassword,
      updatedAt: admin.database.ServerValue.TIMESTAMP 
    });

    return { success: true };
  }

  async resetPassword(data: ResetPasswordDTO) {
    const userRef = this.db.ref('users');
    const snapshot = await userRef.orderByChild('email').equalTo(data.email).once('value');
  
    if (!snapshot.exists()) {
      throw new HttpException({ error: 'User not found' }, HttpStatus.NOT_FOUND);
    }
  
    try {
      await admin.auth().generatePasswordResetLink(data.email, {
        url: process.env.PASSWORD_RESET_URL || 'http://localhost:3000/reset-success',
      });
      
      return { 
        success: true, 
        message: 'Password reset link has been sent to your email' 
      };
    } catch (error) {
      throw new HttpException(
        { error: 'Failed to send reset email' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAccount(input: DeleteAccountDTO, userId: string) {
    const userRef = this.db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    
    if (!snapshot.exists()) {
      throw new HttpException({ error: 'User not found' }, HttpStatus.NOT_FOUND);
    }
  
    const user = snapshot.val();
    const isValidPassword = await bcrypt.compare(input.password, user.password);
    
    if (!isValidPassword) {
      throw new HttpException({ error: 'Invalid password' }, HttpStatus.BAD_REQUEST);
    }
  
    // Delete associated API keys
    const apiKeysRef = this.db.ref('apiKeys');
    const apiKeysSnapshot = await apiKeysRef.orderByChild('userId').equalTo(userId).once('value');
    const deleteApiKeyPromises = [];
    
    apiKeysSnapshot.forEach(child => {
      deleteApiKeyPromises.push(child.ref.remove());
    });
  
    // Delete associated devices
    const devicesRef = this.db.ref('devices');
    const devicesSnapshot = await devicesRef.orderByChild('userId').equalTo(userId).once('value');
    const deleteDevicePromises = [];
    
    devicesSnapshot.forEach(child => {
      deleteDevicePromises.push(child.ref.remove());
    });
  
    // Execute all deletions
    await Promise.all([
      ...deleteApiKeyPromises,
      ...deleteDevicePromises,
      userRef.remove()
    ]);
  
    return { success: true, message: 'Account successfully deleted' };
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

  async getApiKeys(userId: string) {
    const apiKeysRef = this.db.ref('apiKeys');
    const snapshot = await apiKeysRef.orderByChild('userId').equalTo(userId).once('value');
    
    const apiKeys = [];
    snapshot.forEach(child => {
      apiKeys.push({ id: child.key, ...child.val() });
    });
    return apiKeys;
  }

  async revokeApiKey(keyId: string, userId: string) {
    const apiKeyRef = this.db.ref(`apiKeys/${keyId}`);
    const snapshot = await apiKeyRef.once('value');

    if (!snapshot.exists() || snapshot.val().userId !== userId) {
      throw new HttpException({ error: 'API key not found' }, HttpStatus.NOT_FOUND);
    }

    await apiKeyRef.remove();
    return { success: true };
  }
}
