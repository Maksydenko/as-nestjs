import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  type HttpServer,
  HttpStatus
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { RpcException } from '@nestjs/microservices'

import { ContextType } from '../enums'

/**
 * HTTP: default Nest exception handling via {@link BaseExceptionFilter}.
 * RPC: converts service/HTTP exceptions into {@link RpcException}.
 *
 * Must be constructed with the HTTP adapter from {@link HttpAdapterHost}.
 */
@Catch()
export class RpcExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  constructor(applicationRef: HttpServer) {
    super(applicationRef)
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== ContextType.RPC) {
      super.catch(exception, host)

      return
    }

    if (exception instanceof RpcException) {
      throw exception
    }

    if (exception instanceof HttpException) {
      throw new RpcException(exception.getResponse())
    }

    const message =
      exception instanceof Error ? exception.message : 'Internal server error'

    throw new RpcException({
      message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR
    })
  }
}
