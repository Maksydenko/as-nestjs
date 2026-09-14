import type { Request } from 'express'

import type { LoginDto } from '../auth.dto'

export interface LoginRequest extends Request {
  body: LoginDto | Record<string, unknown>
}
