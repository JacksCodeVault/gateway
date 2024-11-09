import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UserRole } from './user-roles.enum';

@Injectable()
export class UsersService {
  private db: admin.database.Database;

  constructor() {
    this.db = admin.database();
  }

  async findOne(params: { [key: string]: any }) {
    let ref = this.db.ref('users');
    
    if (params._id) {
      const snapshot = await ref.child(params._id).once('value');
      return snapshot.exists() ? { id: snapshot.key, ...snapshot.val() } : null;
    }

    if (params.email) {
      const snapshot = await ref.orderByChild('email').equalTo(params.email).once('value');
      if (snapshot.exists()) {
        const key = Object.keys(snapshot.val())[0];
        return { id: key, ...snapshot.val()[key] };
      }
    }

    return null;
  }

  async findAll() {
    const snapshot = await this.db.ref('users').once('value');
    const users = [];
    snapshot.forEach(child => {
      users.push({ id: child.key, ...child.val() });
    });
    return users;
  }

  async create({ name, email, password }: { name: string; email: string; password?: string }) {
    const existingUser = await this.findOne({ email });
    if (existingUser) {
      throw new HttpException(
        { error: 'User already exists with the same email' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userRef = this.db.ref('users').push();
    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role: UserRole.REGULAR,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    };

    await userRef.set(userData);
    return { id: userRef.key, ...userData };
  }

  async update(userId: string, updateData: any) {
    const userRef = this.db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    
    if (!snapshot.exists()) {
      throw new HttpException({ error: 'User not found' }, HttpStatus.NOT_FOUND);
    }

    await userRef.update({
      ...updateData,
      updatedAt: admin.database.ServerValue.TIMESTAMP,
    });

    const updatedSnapshot = await userRef.once('value');
    return { id: userId, ...updatedSnapshot.val() };
  }
}
