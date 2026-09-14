import type { HashOptions } from 'argon2'
import { argon2id } from 'argon2'

import { FileSize } from 'src/shared/enums'

export const JWT_SECRET =
  'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.'

export const PASSWORD_HASH_OPTIONS = {
  memoryCost: 64 * FileSize.KbInMb,
  parallelism: 4,
  timeCost: 3,
  type: argon2id
} as const satisfies HashOptions
