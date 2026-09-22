import { hash } from 'argon2'

import { PASSWORD_HASH_OPTIONS } from 'src/auth/auth.consts'

/**
 * Hashes a plain password with Argon2 using {@link PASSWORD_HASH_OPTIONS}.
 *
 * @param password - Plain-text password from the client.
 * @returns Argon2 hash suitable for storage.
 */
export const hashPassword = async (password: string): Promise<string> =>
  hash(password, PASSWORD_HASH_OPTIONS)
