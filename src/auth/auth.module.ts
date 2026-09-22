import { Module } from '@nestjs/common'

import { AuthService } from './auth.service'

import { AuthController } from './auth.controller'
import { AuthMsController } from './auth.ms.controller'

import { JwtAuthModule } from './jwt/jwt-auth.module'
import { UsersModule } from 'src/users/users.module'

@Module({
  controllers: [AuthController, AuthMsController],
  exports: [AuthService],
  imports: [UsersModule, JwtAuthModule],
  providers: [AuthService]
})
export class AuthModule {}
