import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'

import type { Cache } from 'cache-manager'

import { Time } from 'src/shared/enums'

import { AuthUser } from './users.types'

@Injectable()
export class UsersCacheService {
  private readonly ttlMs = 10 * Time.MillisecondsInMinute

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache
  ) {}

  del(id: string): Promise<boolean> {
    return this.cache.del(this.key(id))
  }

  get(id: string): Promise<AuthUser | undefined> {
    return this.cache.get(this.key(id))
  }

  set(user: AuthUser): Promise<AuthUser> {
    return this.cache.set(this.key(user.id), user, this.ttlMs)
  }

  private key(id: string): string {
    return `user:profile:${id}`
  }
}
