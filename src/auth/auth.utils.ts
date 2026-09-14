import { hash } from 'argon2'

import { PASSWORD_HASH_OPTIONS } from 'src/auth/auth.consts'

export const hashPassword = async (password: string): Promise<string> =>
  hash(password, PASSWORD_HASH_OPTIONS)
