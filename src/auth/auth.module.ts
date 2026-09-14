import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './jwt/jwt.strategy'
import { LocalStrategy } from './local/local.strategy'

import { LoginBodyGuard } from './local/login-body.guard'

import { AuthService } from './auth.service'

import { AuthController } from './auth.controller'

import { UsersModule } from 'src/users/users.module'

import { JWT_SECRET } from './auth.consts'

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: '1d' } })
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, LoginBodyGuard]
})
export class AuthModule {}
