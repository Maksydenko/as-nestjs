import { Test, type TestingModule } from '@nestjs/testing'

import { AuthService } from './auth.service'

import { AuthController } from './auth.controller'

import type { LoginDto, RegisterDto } from './auth.dto'
import type { JwtUser } from './auth.types'

describe('AuthController', () => {
  let controller: AuthController
  let authService: { login: jest.Mock; logout: jest.Mock; register: jest.Mock }

  const jwtUser: JwtUser = { id: 'user-id' }

  beforeEach(async () => {
    authService = {
      login: jest.fn().mockResolvedValue({ access_token: 'access-token' }),
      logout: jest.fn().mockResolvedValue(true),
      register: jest.fn().mockResolvedValue({ access_token: 'access-token' })
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }]
    }).compile()

    controller = module.get(AuthController)
  })

  it('should login and return an access token', async () => {
    const dto: LoginDto = { email: 'email@gmail.com', password: 'Pa$$w0rd!' }

    await expect(controller.login(dto)).resolves.toEqual({
      access_token: 'access-token'
    })
    expect(authService.login).toHaveBeenCalledWith(dto.email, dto.password)
  })

  it('should logout', async () => {
    await expect(controller.logout(jwtUser)).resolves.toBeUndefined()
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
