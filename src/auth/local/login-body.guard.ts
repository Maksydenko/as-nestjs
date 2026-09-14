import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common'

import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { LoginDto } from '../auth.dto'

import { LoginRequest } from './local.types'

@Injectable()
export class LoginBodyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<LoginRequest>()
    const dto = plainToInstance(LoginDto, request.body)
    const errors = await validate(dto, {
      forbidNonWhitelisted: true,
      whitelist: true
    })

    if (errors.length) {
      const messages = errors.flatMap(err =>
        err.constraints ? Object.values(err.constraints) : []
      )

      throw new BadRequestException(messages)
    }

    request.body = dto

    return true
  }
}
