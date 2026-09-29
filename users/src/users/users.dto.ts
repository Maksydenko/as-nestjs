import { ApiPropertyOptional } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

import {
  DEFAULT_USERS_LIMIT,
  DEFAULT_USERS_PAGE,
  MAX_USERS_LIMIT
} from './users.consts'

export class FindUsersQueryDto {
  @ApiPropertyOptional({
    default: DEFAULT_USERS_LIMIT,
    example: DEFAULT_USERS_LIMIT,
    maximum: MAX_USERS_LIMIT,
    minimum: 1,
    type: Number
  })
  @IsInt()
  @IsOptional()
  @Max(MAX_USERS_LIMIT)
  @Min(1)
  @Type(() => Number)
  limit?: number = DEFAULT_USERS_LIMIT

  @ApiPropertyOptional({
    default: DEFAULT_USERS_PAGE,
    example: DEFAULT_USERS_PAGE,
    minimum: 1,
    type: Number
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = DEFAULT_USERS_PAGE
}
