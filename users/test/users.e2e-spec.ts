import { HttpStatus, type INestApplication } from '@nestjs/common'

import request from 'supertest'
import type { App } from 'supertest/types'

import type { AuthUser } from '@users/users/users.types'

import { UsersCacheService } from '@users/users/users-cache.service'

import { checkLoginResponse, createE2eApp, createE2eStamp } from './e2e.utils'

const isAuthUser = (value: unknown): value is AuthUser =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  'email' in value &&
  typeof (value as AuthUser).id === 'string' &&
  typeof (value as AuthUser).email === 'string'

describe('Users (e2e)', () => {
  let app: INestApplication<App>
  let accessToken: string

  const stamp = createE2eStamp().slice(-7)
  const plainPassword = 'Pa$$w0rd!'
  const credentials = {
    confirmPassword: plainPassword,
    email: `email.${stamp}@gmail.com`,
    firstName: 'Name',
    lastName: 'Surname',
    mobileNumber: `+38098${stamp}`,
    password: plainPassword
  }

  beforeAll(async () => {
    app = await createE2eApp()

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(credentials)
      .expect(HttpStatus.CREATED)

    const body = response.body as unknown

    if (!checkLoginResponse(body)) {
      throw new Error('Expected AccessTokenResponse')
    }

    accessToken = body.access_token
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /api/users/me should return the current user', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK)

    const body = response.body as unknown

    if (!isAuthUser(body)) {
      throw new Error('Expected AuthUser')
    }

    expect(body).toEqual(
      expect.objectContaining({
        email: credentials.email,
        firstName: credentials.firstName,
        lastName: credentials.lastName
      })
    )
    expect(body).not.toHaveProperty('password')
  })

  it('GET /api/users/me should reject a missing token', () =>
    request(app.getHttpServer())
      .get('/api/users/me')
      .expect(HttpStatus.UNAUTHORIZED))

  it('GET /api/users should return a paginated list', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users')
      .query({ limit: 10, page: 1 })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK)

    const body = response.body as {
      data?: unknown
      limit?: unknown
      page?: unknown
      total?: unknown
    }

    expect(Array.isArray(body.data)).toBe(true)
    expect(body.limit).toBe(10)
    expect(body.page).toBe(1)
    expect(typeof body.total).toBe('number')
  })

  it('PATCH /api/users/me should update the profile', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ firstName: 'Updated' })
      .expect(HttpStatus.OK)

    const body = response.body as unknown

    if (!isAuthUser(body)) {
      throw new Error('Expected AuthUser')
    }

    expect(body.firstName).toBe('Updated')
    expect(body.email).toBe(credentials.email)
  })

  it('should keep the user profile cached in Redis after register/login', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK)

    const body = response.body as unknown

    if (!isAuthUser(body)) {
      throw new Error('Expected AuthUser')
    }

    const usersCacheService = app.get(UsersCacheService)

    await expect(usersCacheService.get(body.id)).resolves.toEqual(
      expect.objectContaining({
        email: credentials.email,
        firstName: 'Updated',
        id: body.id
      })
    )
  })

  it('should refresh the Redis cache after a profile update', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ lastName: 'Cached' })
      .expect(HttpStatus.OK)

    const body = response.body as unknown

    if (!isAuthUser(body)) {
      throw new Error('Expected AuthUser')
    }

    const usersCacheService = app.get(UsersCacheService)

    await expect(usersCacheService.get(body.id)).resolves.toEqual(
      expect.objectContaining({
        firstName: 'Updated',
        id: body.id,
        lastName: 'Cached'
      })
    )
  })

  it('DELETE /api/users/me should delete the current user', () =>
    request(app.getHttpServer())
      .delete('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NO_CONTENT))

  it('GET /api/users/me should reject after the user was deleted', () =>
    request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.NOT_FOUND))
})
