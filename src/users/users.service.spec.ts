import { NotFoundException } from '@nestjs/common'
import { Test, type TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import type { UpdateDto } from 'src/auth/auth.dto'

import { SortOrder } from 'src/shared/enums'

import { User } from './entities'

import { UsersService } from './users.service'
import { UsersCacheService } from './users-cache.service'

import type { FindUsersQueryDto } from './users.dto'
import type { CreateUser } from './users.types'

describe('UsersService', () => {
  let service: UsersService
  let usersRepository: {
    create: jest.Mock
    delete: jest.Mock
    findAndCount: jest.Mock
    findOneBy: jest.Mock
    save: jest.MockedFunction<(user: User) => Promise<User>>
  }
  let usersCacheService: { del: jest.Mock; get: jest.Mock; set: jest.Mock }

  const userToCreate: CreateUser = {
    email: 'email@gmail.com',
    firstName: 'Name',
    lastName: 'Surname',
    mobileNumber: '+380987654321',
    password: 'Pa$$w0rd!'
  }

  const createdUser: User = { ...userToCreate, id: 'user-id' }
  const { password: _password, ...authUser }: User = createdUser

  beforeEach(async () => {
    usersRepository = {
      create: jest.fn().mockReturnValue(createdUser),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
      findAndCount: jest.fn().mockResolvedValue([[authUser], 1]),
      findOneBy: jest.fn().mockResolvedValue(createdUser),
      save: jest.fn().mockResolvedValue(createdUser)
    }
    usersCacheService = {
      del: jest.fn().mockResolvedValue(true),
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn().mockResolvedValue(authUser)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: usersRepository },
        { provide: UsersCacheService, useValue: usersCacheService }
      ]
    }).compile()

    service = module.get(UsersService)
  })

  it('should create a user', async () => {
    await expect(service.create(userToCreate)).resolves.toEqual(createdUser)

    expect(usersRepository.create).toHaveBeenCalledWith(userToCreate)
    expect(usersRepository.save).toHaveBeenCalledWith(createdUser)
  })

  it('should delete the user and clear the cache', async () => {
    await expect(service.delete(createdUser.id)).resolves.toBeUndefined()

    expect(usersRepository.delete).toHaveBeenCalledWith(createdUser.id)
    expect(usersCacheService.del).toHaveBeenCalledWith(createdUser.id)
  })

  it('should throw when deleting a missing user', async () => {
    usersRepository.delete.mockResolvedValue({ affected: 0 })

    await expect(service.delete(createdUser.id)).rejects.toBeInstanceOf(
      NotFoundException
    )
    expect(usersCacheService.del).not.toHaveBeenCalled()
  })

  it('should return a paginated list of users', async () => {
    const query: FindUsersQueryDto = { limit: 10, page: 1 }

    await expect(service.findMany(query)).resolves.toEqual({
      data: [authUser],
      limit: 10,
      page: 1,
      total: 1
    })

    expect(usersRepository.findAndCount).toHaveBeenCalledWith({
      order: { id: SortOrder.Asc },
      select: {
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        mobileNumber: true
      },
      skip: 0,
      take: 10
    })
  })

  it('should return the cached user from findMe', async () => {
    usersCacheService.get.mockResolvedValue(authUser)

    await expect(service.findMe(authUser.id)).resolves.toEqual(authUser)

    expect(usersCacheService.get).toHaveBeenCalledWith(authUser.id)
    expect(usersRepository.findOneBy).not.toHaveBeenCalled()
    expect(usersCacheService.set).not.toHaveBeenCalled()
  })

  it('should load findMe from the database and cache the user', async () => {
    await expect(service.findMe(authUser.id)).resolves.toEqual(authUser)

    expect(usersCacheService.get).toHaveBeenCalledWith(authUser.id)
    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: authUser.id })
    expect(usersCacheService.set).toHaveBeenCalledWith(authUser)
  })

  it('should throw when findMe cannot find the user', async () => {
    usersRepository.findOneBy.mockResolvedValue(null)

    await expect(service.findMe(authUser.id)).rejects.toBeInstanceOf(
      NotFoundException
    )

    expect(usersCacheService.get).toHaveBeenCalledWith(authUser.id)
    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: authUser.id })
    expect(usersCacheService.set).not.toHaveBeenCalled()
  })

  it('should find one user by where clause', async () => {
    await expect(service.findOne({ email: authUser.email })).resolves.toEqual(
      createdUser
    )

    expect(usersRepository.findOneBy).toHaveBeenCalledWith({
      email: authUser.email
    })
  })

  it('should update the user, hash the password, and refresh the cache', async () => {
    const dto: UpdateDto = {
      confirmPassword: 'NewPa$$w0rd!',
      firstName: 'First',
      lastName: 'Last',
      mobileNumber: '+198765432',
      password: 'NewPa$$w0rd!'
    }
    const updatedUser: User = {
      ...createdUser,
      firstName: dto.firstName!,
      lastName: dto.lastName!,
      mobileNumber: dto.mobileNumber!,
      password: 'hashed-password'
    }
    const { password: _password, ...updatedAuthUser } = updatedUser

    usersRepository.save.mockResolvedValue(updatedUser)
    usersCacheService.set.mockResolvedValue(updatedAuthUser)

    await expect(service.update(authUser.id, dto)).resolves.toEqual(
      updatedAuthUser
    )

    expect(usersRepository.findOneBy).toHaveBeenCalledWith({ id: authUser.id })
    expect(usersRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: dto.firstName,
        lastName: dto.lastName,
        mobileNumber: dto.mobileNumber
      })
    )

    const savedUser = usersRepository.save.mock.calls[0][0]

    expect(typeof savedUser.password).toBe('string')
    expect(savedUser.password).not.toBe(dto.password)
    expect(savedUser).not.toHaveProperty('confirmPassword')

    expect(usersCacheService.set).toHaveBeenCalledWith(updatedAuthUser)
  })

  it('should throw when updating a missing user', async () => {
    usersRepository.findOneBy.mockResolvedValue(null)

    await expect(
      service.update(authUser.id, { firstName: 'First' })
    ).rejects.toBeInstanceOf(NotFoundException)

    expect(usersRepository.save).not.toHaveBeenCalled()
    expect(usersCacheService.set).not.toHaveBeenCalled()
  })
})
