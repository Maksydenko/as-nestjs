import type { HashOptions } from 'argon2'
import { argon2id } from 'argon2'

import { FileSize, Time } from '@users/shared/enums'

export const JWT_SECRET =
  'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.'

export const AUTH_THROTTLE_LIMIT_PER_MINUTE = 10

export const AUTH_THROTTLE_TTL_MS = Time.MillisecondsInMinute

export const UNIQUE_VIOLATION_MESSAGES = {
  email: 'User with this email already exists',
  mobile_number: 'User with this mobile number already exists'
} as const

export const DEFAULT_UNIQUE_VIOLATION_MESSAGE =
  'User with this data already exists'

export const PASSWORD_HASH_OPTIONS = {
  memoryCost: 64 * FileSize.KbInMb,
  parallelism: 4,
  timeCost: 3,
  type: argon2id
} as const satisfies HashOptions
