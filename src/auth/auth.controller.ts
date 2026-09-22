import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Throttle } from '@nestjs/throttler'

import { LoginDto, RegisterDto } from './auth.dto'

import { CurrentUser } from 'src/shared/decorators'

import { JwtAuthGuard } from './jwt/jwt-auth.guard'

import { AuthService } from './auth.service'

import {
  AUTH_THROTTLE_LIMIT_PER_MINUTE,
  AUTH_THROTTLE_TTL_MS
} from './auth.consts'
import type { AccessTokenResponse, JwtUser } from './auth.types'

@ApiTags('auth')
@Controller('auth')
@Throttle({
  default: { limit: AUTH_THROTTLE_LIMIT_PER_MINUTE, ttl: AUTH_THROTTLE_TTL_MS }
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto): Promise<AccessTokenResponse> {
    return this.authService.login(dto.email, dto.password)
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: JwtUser): Promise<void> {
    await this.authService.logout(user.id)
  }

  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<AccessTokenResponse> {
    return this.authService.register(dto)
  }
}
