import type { ValueOf } from '../types'

/**
 * Ascending vs descending sort direction for tables and lists.
 */
export const SortOrder = { ASC: 'asc', DESC: 'desc' } as const
export type SortOrder = ValueOf<typeof SortOrder>
