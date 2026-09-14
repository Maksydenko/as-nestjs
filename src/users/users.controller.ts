import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

import { UpdateDto } from 'src/auth/auth.dto'
import type { JwtRequest } from 'src/auth/auth.types'

import { PaginatedResult } from 'src/shared/types'

import { FindUsersQueryDto } from './users.dto'

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'

import { UsersService } from './users.service'

import { AuthUser } from './users.types'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  delete(@Req() req: JwtRequest): Promise<void> {
    return this.usersService.delete(req.user.id)
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
  findMe(@Req() req: JwtRequest): Promise<AuthUser | null> {
    return this.usersService.findMe(req.user.id)
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateDto })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: JwtRequest, @Body() dto: UpdateDto): Promise<AuthUser> {
    return this.usersService.update(req.user.id, dto)
  }
}
