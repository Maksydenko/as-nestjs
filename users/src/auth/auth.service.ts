import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { hash, verify } from 'argon2'
import { QueryFailedError } from 'typeorm'

import { AuthUser } from '@users/users/users.types'

import { PgErrorCode } from '@users/shared/enums'

import { normalizePhoneToE164 } from '@users/shared/utils'

import { RegisterDto } from './auth.dto'

import { UsersService } from '@users/users/users.service'
import { UsersCacheService } from '@users/users/users-cache.service'

import { PASSWORD_HASH_OPTIONS } from './auth.consts'
import { AccessTokenResponse, JwtUser, PostgresDriverError } from './auth.types'
import { getUniqueViolationMessage } from './auth.utils'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly usersCacheService: UsersCacheService
  ) {}

  async login(email: string, password: string): Promise<AccessTokenResponse> {
    const user = await this.validate(email, password)

    return this.issueAccessToken(user)
  }

  logout(userId: string): Promise<boolean> {
    return this.usersCacheService.del(userId)
  }

  async register(dto: RegisterDto): Promise<AccessTokenResponse> {
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

      return this.issueAccessToken(authUser)
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err.driverError as PostgresDriverError).code ===
          PgErrorCode.UniqueViolation
      ) {
        throw new ConflictException(
          getUniqueViolationMessage(err.driverError as PostgresDriverError)
        )
      }

      throw err
    }
  }

  private async issueAccessToken(user: AuthUser): Promise<AccessTokenResponse> {
    await this.usersCacheService.set(user)
    const payload: JwtUser = { id: user.id }
    const accessToken = this.jwtService.sign(payload)

    return { access_token: accessToken }
  }

  private async validate(
    username: string,
    password: string
  ): Promise<AuthUser> {
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
