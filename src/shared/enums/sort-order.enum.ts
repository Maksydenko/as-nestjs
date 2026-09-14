import type { ValueOf } from '../types'

/**
 * Ascending vs descending sort direction for tables and lists.
 */
export const SortOrder = { Asc: 'asc', Desc: 'desc' } as const
export type SortOrder = ValueOf<typeof SortOrder>
