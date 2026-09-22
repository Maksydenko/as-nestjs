import type { INestApplication } from '@nestjs/common'

import request from 'supertest'
import type { App } from 'supertest/types'

import { checkLoginResponse, createE2eApp, createE2eStamp } from './e2e.utils'

describe('Auth (e2e)', () => {
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
  })

  afterAll(async () => {
    if (accessToken) {
      await request(app.getHttpServer())
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
    }

    await app.close()
  })

  it('POST /api/auth/register should create a user and return an access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(credentials)
      .expect(201)

    const body = response.body as unknown

    if (!checkLoginResponse(body)) {
      throw new Error('Expected AccessTokenResponse')
    }

    expect(body.access_token.length).toBeGreaterThan(0)
    accessToken = body.access_token
  })

  it('POST /api/auth/register should reject a duplicate user', () =>
    request(app.getHttpServer())
      .post('/api/auth/register')
      .send(credentials)
      .expect(409))

  it('POST /api/auth/register should reject an invalid body', () =>
    request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'not-an-email' })
      .expect(400))

  it('POST /api/auth/login should return an access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: credentials.email, password: plainPassword })
      .expect(200)

    const body = response.body as unknown

    if (!checkLoginResponse(body)) {
      throw new Error('Expected AccessTokenResponse')
    }

    expect(body.access_token.length).toBeGreaterThan(0)
    accessToken = body.access_token
  })

  it('POST /api/auth/login should reject invalid credentials', () =>
    request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: credentials.email, password: 'WrongPass1' })
      .expect(401))

  it('POST /api/auth/login should reject an empty body', () =>
    request(app.getHttpServer()).post('/api/auth/login').send({}).expect(400))

  it('POST /api/auth/logout should return no content', () =>
    request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204))

  it('POST /api/auth/logout should reject a missing token', () =>
    request(app.getHttpServer()).post('/api/auth/logout').expect(401))
})
