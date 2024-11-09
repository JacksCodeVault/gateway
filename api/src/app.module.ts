import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GatewayModule,
  ],
})
export class AppModule {}
