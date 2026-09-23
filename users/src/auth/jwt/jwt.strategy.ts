import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { ExtractJwt, Strategy } from 'passport-jwt'

import { JWT_SECRET } from '../auth.consts'
import type { JwtPayload, JwtUser } from '../auth.types'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    })
  }

  validate(payload: JwtPayload): JwtUser {
    return { id: payload.id }
  }
}
