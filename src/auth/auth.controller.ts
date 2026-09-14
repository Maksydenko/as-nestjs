import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'

import { Time } from 'src/shared/enums'

import { LoginDto, RegisterDto } from './auth.dto'

import { JwtAuthGuard } from './jwt/jwt-auth.guard'
import { LocalAuthGuard } from './local/local-auth.guard'
import { LoginBodyGuard } from './local/login-body.guard'

import { AuthService } from './auth.service'

import type { AuthenticatedRequest, LoginResponse } from './auth.types'

@ApiTags('auth')
@Controller('auth')
@Throttle({ default: { limit: 10, ttl: Time.MillisecondsInMinute } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UseGuards(LoginBodyGuard, LocalAuthGuard)
  login(@Req() req: AuthenticatedRequest): Promise<LoginResponse> {
    return this.authService.login(req.user)
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: AuthenticatedRequest): Promise<void> {
    return this.authService.logout(req)
  }

  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<LoginResponse> {
    return this.authService.register(dto)
  }
}
