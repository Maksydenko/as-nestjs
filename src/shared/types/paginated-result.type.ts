/**
 * Paginated list response with the current page slice and totals.
 */
export interface PaginatedResult<T> {
  data: T[]
  limit: number
  page: number
  total: number
}
