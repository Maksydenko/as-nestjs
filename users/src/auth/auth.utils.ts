import { hash } from 'argon2'

import {
  DEFAULT_UNIQUE_VIOLATION_MESSAGE,
  PASSWORD_HASH_OPTIONS,
  UNIQUE_VIOLATION_MESSAGES
} from '@users/auth/auth.consts'
import type { PostgresDriverError } from '@users/auth/auth.types'

/**
 * Hashes a plain password with Argon2 using {@link PASSWORD_HASH_OPTIONS}.
 *
 * @param password - Plain-text password from the client.
 * @returns Argon2 hash suitable for storage.
 */
export const hashPassword = async (password: string): Promise<string> =>
  hash(password, PASSWORD_HASH_OPTIONS)

/**
 * Maps a PostgreSQL unique-violation driver error to a client-facing message.
 *
 * @param driverError - Postgres driver error (expects `detail` like `Key (email)=(...)`).
 * @returns Field-specific conflict message, or a generic fallback.
 */
export const getUniqueViolationMessage = (
  driverError: PostgresDriverError
): string => {
  const column = driverError.detail?.match(/Key \(([^)]+)\)=/)?.[1]

  if (column && column in UNIQUE_VIOLATION_MESSAGES) {
    return UNIQUE_VIOLATION_MESSAGES[
      column as keyof typeof UNIQUE_VIOLATION_MESSAGES
    ]
  }

  return DEFAULT_UNIQUE_VIOLATION_MESSAGE
}
