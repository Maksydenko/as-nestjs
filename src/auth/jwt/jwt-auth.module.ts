import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { JwtStrategy } from './jwt.strategy'

import { JwtAuthGuard } from './jwt-auth.guard'

import { JWT_SECRET } from '../auth.consts'

@Module({
  exports: [JwtAuthGuard, JwtModule, PassportModule],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: JWT_SECRET, signOptions: { expiresIn: '1d' } })
  ],
  providers: [JwtStrategy, JwtAuthGuard]
})
export class JwtAuthModule {}
