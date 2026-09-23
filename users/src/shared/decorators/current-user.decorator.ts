import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

interface RequestWithUser {
  user?: unknown
}

/**
 * Resolves the authenticated user from HTTP `req.user` or RPC payload `user`
 * (attached by {@link JwtAuthGuard}).
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'rpc') {
      return context.switchToRpc().getData<RequestWithUser>().user
    }

    return context.switchToHttp().getRequest<RequestWithUser>().user
  }
)
