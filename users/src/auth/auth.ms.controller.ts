import { Controller, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { UsersMsCmd } from '@app/shared'

import { LoginDto, RegisterDto } from './auth.dto'

import { CurrentUser } from '@users/shared/decorators'

import { JwtAuthGuard } from './jwt/jwt-auth.guard'

import { AuthService } from './auth.service'

import type { AccessTokenResponse, JwtUser } from './auth.types'

@Controller()
export class AuthMsController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(UsersMsCmd.AuthLogin)
  login(@Payload() dto: LoginDto): Promise<AccessTokenResponse> {
    return this.authService.login(dto.email, dto.password)
  }

  @MessagePattern(UsersMsCmd.AuthLogout)
  @UseGuards(JwtAuthGuard)
  logout(@CurrentUser() user: JwtUser): Promise<boolean> {
    return this.authService.logout(user.id)
  }

  @MessagePattern(UsersMsCmd.AuthRegister)
  register(@Payload() dto: RegisterDto): Promise<AccessTokenResponse> {
    return this.authService.register(dto)
  }
}
