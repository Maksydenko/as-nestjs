import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './entities'

import { UsersService } from './users.service'
import { UsersCacheService } from './users-cache.service'

import { UsersController } from './users.controller'

@Module({
  controllers: [UsersController],
  exports: [UsersService, UsersCacheService],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UsersCacheService]
})
export class UsersModule {}
