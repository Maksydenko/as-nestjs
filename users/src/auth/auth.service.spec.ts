import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, type TestingModule } from '@nestjs/testing'

import { hash } from 'argon2'
import { type FindOptionsWhere, QueryFailedError } from 'typeorm'

import type { User } from '@users/users/entities'
import type { AuthUser, CreateUser } from '@users/users/users.types'

import { PgErrorCode } from '@users/shared/enums'

import { AuthService } from './auth.service'
import { UsersService } from '@users/users/users.service'
import { UsersCacheService } from '@users/users/users-cache.service'

import { PASSWORD_HASH_OPTIONS } from './auth.consts'
import type { RegisterDto } from './auth.dto'

describe('AuthService', () => {
  let service: AuthService
  let jwtService: { sign: jest.Mock }
  let usersCacheService: { del: jest.Mock; set: jest.Mock }
  let usersService: {
    create: jest.MockedFunction<(data: CreateUser) => Promise<User>>
    findOne: jest.MockedFunction<
      (where: FindOptionsWhere<User>) => Promise<null | User>
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
      del: jest.fn().mockResolvedValue(true),
      set: jest.fn().mockResolvedValue(authUser)
    }
    usersService = {
      create: jest
        .fn<Promise<User>, [CreateUser]>()
        .mockResolvedValue(createdUser),
      findOne: jest
        .fn<Promise<null | User>, [FindOptionsWhere<User>]>()
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

  it('should login and return an access token', async () => {
    await expect(service.login(authUser.email, plainPassword)).resolves.toEqual(
      { access_token: 'access-token' }
    )

    expect(usersService.findOne).toHaveBeenCalledWith({ email: authUser.email })
    expect(usersCacheService.set).toHaveBeenCalledWith(authUser)
    expect(jwtService.sign).toHaveBeenCalledWith({ id: authUser.id })
  })

  it('should reject login when credentials are invalid', async () => {
    usersService.findOne.mockResolvedValue(null)

    await expect(
      service.login(authUser.email, plainPassword)
    ).rejects.toBeInstanceOf(UnauthorizedException)

    expect(usersCacheService.set).not.toHaveBeenCalled()
    expect(jwtService.sign).not.toHaveBeenCalled()
  })

  it('should reject login when the password is invalid', async () => {
    await expect(
      service.login(authUser.email, 'Wr0ngPa$$')
    ).rejects.toBeInstanceOf(UnauthorizedException)

    expect(usersCacheService.set).not.toHaveBeenCalled()
    expect(jwtService.sign).not.toHaveBeenCalled()
  })

  it('should clear the user cache by user id', async () => {
    await expect(service.logout(authUser.id)).resolves.toBe(true)

    expect(usersCacheService.del).toHaveBeenCalledWith(authUser.id)
  })

  it('should reject logout when cache deletion fails', async () => {
    const error = new Error('cache delete failed')

    usersCacheService.del.mockRejectedValue(error)

    await expect(service.logout(authUser.id)).rejects.toBe(error)
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
      code: PgErrorCode.UniqueViolation,
      detail: `Key (email)=(${authUser.email}) already exists.`
    })

    usersService.create.mockRejectedValue(
      new QueryFailedError('', [], driverError)
    )

    await expect(service.register(registerDto)).rejects.toThrow(
      'User with this email already exists'
    )
  })

  it('should map mobile_number unique violations to a field-specific message', async () => {
    const registerDto: RegisterDto = {
      confirmPassword: plainPassword,
      email: authUser.email,
      firstName: authUser.firstName,
      lastName: authUser.lastName,
      mobileNumber: authUser.mobileNumber,
      password: plainPassword
    }
    const driverError = Object.assign(new Error('duplicate key'), {
      code: PgErrorCode.UniqueViolation,
      detail: `Key (mobile_number)=(${authUser.mobileNumber}) already exists.`
    })

    usersService.create.mockRejectedValue(
      new QueryFailedError('', [], driverError)
    )

    await expect(service.register(registerDto)).rejects.toThrow(
      'User with this mobile number already exists'
    )
  })
})
