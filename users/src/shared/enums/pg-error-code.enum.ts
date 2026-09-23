import type { ValueOf } from '../types'

/**
 * PostgreSQL SQLSTATE codes used when mapping driver errors.
 */
export const PgErrorCode = { UniqueViolation: '23505' } as const
export type PgErrorCode = ValueOf<typeof PgErrorCode>
