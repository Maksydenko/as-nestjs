import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { FindOptionsWhere, Repository } from 'typeorm'

import { UpdateDto } from 'src/auth/auth.dto'
import { hashPassword } from 'src/auth/auth.utils'

import { SortOrder } from 'src/shared/enums'

import { PaginatedResult } from 'src/shared/types'

import { normalizePhoneToE164 } from 'src/shared/utils'

import { User } from './entities'

import { FindUsersQueryDto } from './users.dto'

import { UsersCacheService } from './users-cache.service'

import { DEFAULT_USERS_LIMIT, DEFAULT_USERS_PAGE } from './users.consts'
import { AuthUser, CreateUser } from './users.types'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly usersCacheService: UsersCacheService
  ) {}

  async create(data: CreateUser): Promise<User> {
    const user = this.usersRepository.create(data)

    return this.usersRepository.save(user)
  }

  async delete(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id)

    if (!result.affected) {
      throw new NotFoundException('User not found')
    }

    await this.usersCacheService.del(id)
  }

  async findMany(query: FindUsersQueryDto): Promise<PaginatedResult<AuthUser>> {
    const page = query.page ?? DEFAULT_USERS_PAGE
    const limit = query.limit ?? DEFAULT_USERS_LIMIT
    const skip = (page - 1) * limit

    const [users, total] = await this.usersRepository.findAndCount({
      order: { id: SortOrder.Asc },
      select: {
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        mobileNumber: true
      },
      skip,
      take: limit
    })

    return { data: users, limit, page, total }
  }

  async findMe(id: string): Promise<AuthUser> {
    const cachedUser = await this.usersCacheService.get(id)

    if (cachedUser) {
      return cachedUser
    }

    const user = await this.usersRepository.findOneBy({ id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const { password: _password, ...authUser } = user
    await this.usersCacheService.set(authUser)

    return authUser
  }

  async findOne(where: FindOptionsWhere<User>): Promise<null | User> {
    return this.usersRepository.findOneBy(where)
  }

  async update(id: string, dto: UpdateDto): Promise<AuthUser> {
    const {
      confirmPassword: _confirmPassword,
      mobileNumber,
      password,
      ...data
    } = dto
    const updatedData: Partial<User> = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    )

    if (password) {
      updatedData.password = await hashPassword(password)
    }

    if (mobileNumber) {
      updatedData.mobileNumber = normalizePhoneToE164(mobileNumber)
    }

    const user = await this.usersRepository.findOneBy({ id })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    Object.assign(user, updatedData)

    const { password: _password, ...updatedAuthUser } =
      await this.usersRepository.save(user)
    await this.usersCacheService.set(updatedAuthUser)

    return updatedAuthUser
  }
}
