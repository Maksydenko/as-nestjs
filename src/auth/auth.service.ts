import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { hash, verify } from 'argon2'
import { QueryFailedError } from 'typeorm'

import { AuthUser } from 'src/users/users.types'

import { normalizePhoneToE164 } from 'src/shared/utils'

import { RegisterDto } from './auth.dto'

import { UsersService } from 'src/users/users.service'
import { UsersCacheService } from 'src/users/users-cache.service'

import { PASSWORD_HASH_OPTIONS } from './auth.consts'
import {
  AuthenticatedRequest,
  JwtUser,
  LoginResponse,
  PostgresDriverError
} from './auth.types'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly usersCacheService: UsersCacheService
  ) {}

  async login(user: AuthUser): Promise<LoginResponse> {
    await this.usersCacheService.set(user)
    const payload: JwtUser = { id: user.id }

    return { access_token: this.jwtService.sign(payload) }
  }

  async logout(req: AuthenticatedRequest): Promise<void> {
    await this.usersCacheService.del(req.user.id)
    req.logout(() => {})
  }

  async register(dto: RegisterDto): Promise<LoginResponse> {
    const {
      confirmPassword: _confirmPassword,
      mobileNumber,
      password,
      ...restDto
    } = dto
    const hashedPassword = await hash(password, PASSWORD_HASH_OPTIONS)

    try {
      const createdUser = await this.usersService.create({
        mobileNumber: normalizePhoneToE164(mobileNumber),
        password: hashedPassword,
        ...restDto
      })
      const { password: _password, ...authUser } = createdUser

      return this.login(authUser)
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err.driverError as PostgresDriverError).code === '23505'
      ) {
        throw new ConflictException('User with this data already exists')
      }

      throw err
    }
  }

  async validate(username: string, password: string): Promise<AuthUser> {
    const user = await this.usersService.findOne({ email: username })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const { password: userPassword, ...authUser } = user
    const isMatch = await verify(userPassword, password)

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return authUser
  }
}
