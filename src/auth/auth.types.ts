import type { Request } from 'express'

import type { AuthUser } from 'src/users/users.types'

/**
 * MS payload that carries a JWT for {@link JwtAuthGuard} (logout and similar).
 */
export interface AccessTokenInput {
  access_token: string
}

/**
 * Login / register response with a signed access token.
 */
export interface AccessTokenResponse {
  access_token: string
}

/**
 * Express request after local auth, with a full {@link AuthUser} on `user`.
 */
export interface AuthenticatedRequest extends Request {
  user: AuthUser
}

/**
 * Decoded JWT claims: app fields plus standard `iat` / `exp`.
 */
export interface JwtPayload extends JwtUser {
  exp: number
  iat: number
}

/**
 * Request or RPC-shaped object whose `user` is the JWT subject ({@link JwtUser}).
 */
export interface JwtRequest {
  user: JwtUser
}

/**
 * Authenticated principal from JWT validation (`JwtStrategy.validate`).
 */
export interface JwtUser {
  id: string
}

/**
 * Narrow shape of a PostgreSQL driver error used when mapping unique violations.
 */
export interface PostgresDriverError {
  code?: string
  constraint?: string
}
