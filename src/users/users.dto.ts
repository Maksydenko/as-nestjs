import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

import { MAX_USERS_LIMIT } from './users.consts'

export class FindUsersQueryDto {
  @IsInt()
  @IsOptional()
  @Max(MAX_USERS_LIMIT)
  @Min(1)
  @Type(() => Number)
  limit?: number = 10

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1
}
