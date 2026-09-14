import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Strategy } from 'passport-local'

import { AuthUser } from 'src/users/users.types'

import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' })
  }

  validate(username: string, password: string): Promise<AuthUser> {
    return this.authService.validate(username, password)
  }
}
