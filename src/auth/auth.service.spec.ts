import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'

import { hash } from 'argon2'
import { QueryFailedError } from 'typeorm'

import type { User } from 'src/users/entities'
import type { AuthUser, CreateUser } from 'src/users/users.types'

import { AuthService } from './auth.service'
import { UsersService } from 'src/users/users.service'
import { UsersCacheService } from 'src/users/users-cache.service'

import { PASSWORD_HASH_OPTIONS } from './auth.consts'
import type { RegisterDto } from './auth.dto'
import type { AuthenticatedRequest } from './auth.types'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: { sign: jest.Mock }
  let usersCacheService: { del: jest.Mock; set: jest.Mock }
  let usersService: {
    create: jest.MockedFunction<(data: CreateUser) => Promise<User>>
    findOne: jest.MockedFunction<
      (where: { email: string }) => Promise<null | User>
    >
  }

  const plainPassword = 'Pa$$w0rd!'
  const authUser: AuthUser = {
    email: 'email@gmail.com',
    firstName: 'Name',
    id: 'user-id',
    lastName: 'Surname',
    mobileNumber: '+380987654321'
  }

  let createdUser: User

  beforeAll(async () => {
    createdUser = {
      ...authUser,
      password: await hash(plainPassword, PASSWORD_HASH_OPTIONS)
    }
  })

  beforeEach(async () => {
    jwtService = { sign: jest.fn().mockReturnValue('access-token') }
    usersCacheService = {
      del: jest.fn(),
      set: jest.fn().mockResolvedValue(authUser)
    }
    usersService = {
      create: jest
        .fn<Promise<User>, [CreateUser]>()
        .mockResolvedValue(createdUser),
      findOne: jest
        .fn<Promise<null | User>, [{ email: string }]>()
        .mockResolvedValue(createdUser)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtService },
        { provide: UsersService, useValue: usersService },
        { provide: UsersCacheService, useValue: usersCacheService }
      ]
    }).compile()

    service = module.get(AuthService)
  })

  it('should cache the user and return an access token', async () => {
    await expect(service.login(authUser)).resolves.toEqual({
      access_token: 'access-token'
    })

    expect(usersCacheService.set).toHaveBeenCalledWith(authUser)
    expect(jwtService.sign).toHaveBeenCalledWith({ id: authUser.id })
  })

  it('should clear the user cache and logout', async () => {
    const logout = jest.fn((cb: () => void) => cb())
    const req = { logout, user: authUser } as unknown as AuthenticatedRequest

    await expect(service.logout(req)).resolves.toBeUndefined()

    expect(logout).toHaveBeenCalled()
    expect(usersCacheService.del).toHaveBeenCalledWith(authUser.id)
  })

  it('should register a user, cache them, and return an access token', async () => {
    const registerDto: RegisterDto = {
      confirmPassword: plainPassword,
      email: authUser.email,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      mobileNumber: authUser.mobileNumber,
      password: plainPassword
    }

    await expect(service.register(registerDto)).resolves.toEqual({
      access_token: 'access-token'
    })

    expect(usersService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        mobileNumber: registerDto.mobileNumber
      })
    )

    const createPayload = usersService.create.mock.calls[0][0]

    expect(typeof createPayload.password).toBe('string')
    expect(createPayload.password).not.toBe(registerDto.password)
    expect(createPayload).not.toHaveProperty('confirmPassword')

    expect(usersCacheService.set).toHaveBeenCalledWith(authUser)
    expect(jwtService.sign).toHaveBeenCalledWith({ id: authUser.id })
  })

  it('should throw ConflictException when register hits a unique constraint', async () => {
    const registerDto: RegisterDto = {
      confirmPassword: plainPassword,
      email: authUser.email,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      mobileNumber: authUser.mobileNumber,
      password: plainPassword
    }
    const driverError = Object.assign(new Error('duplicate key'), {
      code: '23505'
    })

    usersService.create.mockRejectedValue(
      new QueryFailedError('', [], driverError)
    )

    await expect(service.register(registerDto)).rejects.toBeInstanceOf(
      ConflictException
    )
  })

  it('should validate credentials and return the auth user', async () => {
    await expect(
      service.validate(authUser.email, plainPassword)
    ).resolves.toEqual(authUser)

    expect(usersService.findOne).toHaveBeenCalledWith({ email: authUser.email })
  })

  it('should throw UnauthorizedException when the user is missing', async () => {
    usersService.findOne.mockResolvedValue(null)

    await expect(
      service.validate(authUser.email, plainPassword)
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })

  it('should throw UnauthorizedException when the password is invalid', async () => {
    await expect(
      service.validate(authUser.email, 'Wr0ngPa$$')
    ).rejects.toBeInstanceOf(UnauthorizedException)
  })
})
