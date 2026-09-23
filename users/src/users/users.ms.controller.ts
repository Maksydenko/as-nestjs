import { Controller, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { UsersMsCmd } from '@app/shared'

import type { AccessTokenInput, JwtUser } from '@users/auth/auth.types'
import type { PaginatedResult } from '@users/shared/types'

import { FindUsersQueryDto } from './users.dto'
import { UpdateDto } from '@users/auth/auth.dto'

import { CurrentUser } from '@users/shared/decorators'

import { JwtAuthGuard } from '@users/auth/jwt/jwt-auth.guard'

import { UsersService } from './users.service'

import type { AuthUser } from './users.types'

interface MsPayloadUser {
  user?: JwtUser
}

@Controller()
export class UsersMsController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(UsersMsCmd.UsersDeleteMe)
  @UseGuards(JwtAuthGuard)
  deleteMe(@CurrentUser() user: JwtUser): Promise<void> {
    return this.usersService.delete(user.id)
  }

  @MessagePattern(UsersMsCmd.UsersFindMany)
  @UseGuards(JwtAuthGuard)
  findMany(
    @Payload() data: AccessTokenInput & FindUsersQueryDto & MsPayloadUser
  ): Promise<PaginatedResult<AuthUser>> {
    const { access_token: _accessToken, user: _user, ...query } = data

    return this.usersService.findMany(query)
  }

  @MessagePattern(UsersMsCmd.UsersMe)
  @UseGuards(JwtAuthGuard)
  findMe(@CurrentUser() user: JwtUser): Promise<AuthUser> {
    return this.usersService.findMe(user.id)
  }

  @MessagePattern(UsersMsCmd.UsersUpdateMe)
  @UseGuards(JwtAuthGuard)
  updateMe(
    @CurrentUser() user: JwtUser,
    @Payload() data: AccessTokenInput & MsPayloadUser & UpdateDto
  ): Promise<AuthUser> {
    const { access_token: _accessToken, user: _user, ...dto } = data

    return this.usersService.update(user.id, dto)
  }
}
