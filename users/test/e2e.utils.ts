import type { CanActivate, INestApplication } from '@nestjs/common'
import { ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ThrottlerGuard } from '@nestjs/throttler'

import type { App } from 'supertest/types'

import type { AccessTokenResponse } from '@users/auth/auth.types'

import { AppModule } from '@users/app.module'

/**
 * Exclusive upper bound for the random suffix in e2e uniqueness stamps.
 */
const STAMP_RANDOM_RANGE = 100

/**
 * No-op guard so e2e suites are not affected by rate limits.
 */
class DisableThrottleGuard implements CanActivate {
  canActivate(): boolean {
    return true
  }
}

/**
 * Builds a unique stamp for e2e emails and phone numbers within one run.
 *
 * @returns Timestamp plus a short random suffix.
 *
 * @example
 * ```ts
 * createE2eStamp() // "1710000000000012"
 * ```
 */
export const createE2eStamp = (): string =>
  `${Date.now()}${Math.floor(Math.random() * STAMP_RANDOM_RANGE)}`

/**
 * Boots a Nest app for e2e tests with the same global prefix and validation as production.
 *
 * @returns Initialized Nest application ready for supertest.
 */
export const createE2eApp = async (): Promise<INestApplication<App>> => {
  const moduleFixture = await Test.createTestingModule({ imports: [AppModule] })
    .overrideGuard(ThrottlerGuard)
    .useClass(DisableThrottleGuard)
    .compile()

  const app: INestApplication<App> = moduleFixture.createNestApplication()

  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true
    })
  )
  await app.init()

  return app
}

/**
 * Checks whether an unknown HTTP body matches {@link AccessTokenResponse}.
 *
 * @param value - Parsed response body from supertest.
 * @returns Whether `value` looks like a login payload with `access_token`.
 */
export const checkLoginResponse = (
  value: unknown
): value is AccessTokenResponse =>
  typeof value === 'object' &&
  value !== null &&
  'access_token' in value &&
  typeof value.access_token === 'string'
