import type { User } from './entities'

export type AuthUser = Omit<User, 'password'>

export type CreateUser = Omit<User, 'id'>
