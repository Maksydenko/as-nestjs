import { Test, type TestingModule } from '@nestjs/testing'

import type { AuthUser } from 'src/users/users.types'

import { AuthService } from './auth.service'

import { AuthController } from './auth.controller'

import type { RegisterDto } from './auth.dto'
import type { AuthenticatedRequest } from './auth.types'

describe('AuthController', () => {
  let controller: AuthController
  let authService: { login: jest.Mock; logout: jest.Mock; register: jest.Mock }

  const authUser: AuthUser = {
    email: 'email@gmail.com',
    firstName: 'Name',
    id: 'user-id',
    lastName: 'Surname',
    mobileNumber: '+380987654321'
  }

  beforeEach(async () => {
    authService = {
      login: jest.fn().mockResolvedValue({ access_token: 'access-token' }),
      logout: jest.fn().mockResolvedValue(undefined),
      register: jest.fn().mockResolvedValue({ access_token: 'access-token' })
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }]
    }).compile()

    controller = module.get(AuthController)
  })

  it('should login and return an access token', async () => {
    const req = { user: authUser } as AuthenticatedRequest

    await expect(controller.login(req)).resolves.toEqual({
      access_token: 'access-token'
    })
    expect(authService.login).toHaveBeenCalledWith(authUser)
  })

  it('should logout', async () => {
    const req = { user: authUser } as AuthenticatedRequest

    await expect(controller.logout(req)).resolves.toBeUndefined()
    expect(authService.logout).toHaveBeenCalledWith(req)
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
