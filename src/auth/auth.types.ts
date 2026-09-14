import type { Request } from 'express'

import type { AuthUser } from 'src/users/users.types'

export interface AuthenticatedRequest extends Request {
  user: AuthUser
}

export interface JwtPayload extends JwtUser {
  exp: number
  iat: number
}

export interface JwtRequest {
  user: JwtUser
}

export interface JwtUser {
  id: string
}

export interface LoginResponse {
  access_token: string
}

export interface PostgresDriverError {
  code?: string
  constraint?: string
}
