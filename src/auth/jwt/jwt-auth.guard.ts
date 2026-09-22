import {
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import type { Request } from 'express'

interface RpcAuthRequest {
  headers: { authorization?: string }
}

/**
 * JWT guard for HTTP (Bearer header) and RPC (`access_token` in the payload).
 * Attaches `user` to the RPC payload so {@link CurrentUser} can read it.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): Request | RpcAuthRequest {
    if (context.getType() === 'rpc') {
      const data = context.switchToRpc().getData<{ access_token?: string }>()

      return {
        headers: {
          authorization: data.access_token
            ? `Bearer ${data.access_token}`
            : undefined
        }
      }
    }

    return context.switchToHttp().getRequest<Request>()
  }

  handleRequest<TUser>(
    err: Error | null,
    user: TUser,
    _info: unknown,
    context: ExecutionContext
  ): TUser {
    if (err || !user) {
      throw err ?? new UnauthorizedException()
    }

    if (context.getType() === 'rpc') {
      const data = context.switchToRpc().getData<{ user?: TUser }>()

      data.user = user
    }

    return user
  }
}
