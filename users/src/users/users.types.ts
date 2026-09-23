import type { User } from './entities'

/**
 * User entity without the password hash — safe for API and auth responses.
 */
export type AuthUser = Omit<User, 'password'>

/**
 * Fields required to insert a new user (entity without generated `id`).
 */
export type CreateUser = Omit<User, 'id'>
