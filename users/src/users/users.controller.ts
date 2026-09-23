import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import type { JwtUser } from '@users/auth/auth.types'
import type { PaginatedResult } from '@users/shared/types'

import { FindUsersQueryDto } from './users.dto'
import { UpdateDto } from '@users/auth/auth.dto'

import { CurrentUser } from '@users/shared/decorators'

import { JwtAuthGuard } from '@users/auth/jwt/jwt-auth.guard'

import { UsersService } from './users.service'

import type { AuthUser } from './users.types'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  deleteMe(@CurrentUser() user: JwtUser): Promise<void> {
    return this.usersService.delete(user.id)
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  findMany(
    @Query() query: FindUsersQueryDto
  ): Promise<PaginatedResult<AuthUser>> {
    return this.usersService.findMany(query)
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  findMe(@CurrentUser() user: JwtUser): Promise<AuthUser> {
    return this.usersService.findMe(user.id)
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateDto })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateDto
  ): Promise<AuthUser> {
    return this.usersService.update(user.id, dto)
  }
}
