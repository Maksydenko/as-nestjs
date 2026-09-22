import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './entities'

import { UsersService } from './users.service'
import { UsersCacheService } from './users-cache.service'

import { UsersController } from './users.controller'
import { UsersMsController } from './users.ms.controller'

import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module'

@Module({
  controllers: [UsersController, UsersMsController],
  exports: [UsersService, UsersCacheService],
  imports: [TypeOrmModule.forFeature([User]), JwtAuthModule],
  providers: [UsersService, UsersCacheService]
})
export class UsersModule {}
