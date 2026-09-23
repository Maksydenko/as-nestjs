jest.mock('@nestjs/microservices', () => ({
  MessagePattern: () => () => undefined,
  Payload: () => () => undefined
}))

import { Test, type TestingModule } from '@nestjs/testing'

import { AuthService } from './auth.service'

import { AuthMsController } from './auth.ms.controller'

import type { LoginDto, RegisterDto } from './auth.dto'
import type { JwtUser } from './auth.types'

describe('AuthMsController', () => {
  let controller: AuthMsController
  let authService: { login: jest.Mock; logout: jest.Mock; register: jest.Mock }

  const jwtUser: JwtUser = { id: 'user-id' }

  beforeEach(async () => {
    authService = {
      login: jest.fn().mockResolvedValue({ access_token: 'access-token' }),
      logout: jest.fn().mockResolvedValue(true),
      register: jest.fn().mockResolvedValue({ access_token: 'access-token' })
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthMsController],
      providers: [{ provide: AuthService, useValue: authService }]
    }).compile()

    controller = module.get(AuthMsController)
  })

  it('should login and return an access token', async () => {
    const dto: LoginDto = { email: 'email@gmail.com', password: 'Pa$$w0rd!' }

    await expect(controller.login(dto)).resolves.toEqual({
      access_token: 'access-token'
    })
    expect(authService.login).toHaveBeenCalledWith(dto.email, dto.password)
  })

  it('should logout by user id', async () => {
    await expect(controller.logout(jwtUser)).resolves.toBe(true)
    expect(authService.logout).toHaveBeenCalledWith(jwtUser.id)
  })

  it('should register and return an access token', async () => {
    const registerDto: RegisterDto = {
      confirmPassword: 'Pa$$w0rd!',
      email: 'email@gmail.com',
      firstName: 'Name',
      lastName: 'Surname',
      mobileNumber: '+380987654321',
      password: 'Pa$$w0rd!'
    }

    await expect(controller.register(registerDto)).resolves.toEqual({
      access_token: 'access-token'
    })
    expect(authService.register).toHaveBeenCalledWith(registerDto)
  })
})
