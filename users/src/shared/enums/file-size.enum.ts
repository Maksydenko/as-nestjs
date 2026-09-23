import type { ValueOf } from '../types'

const BYTES_IN_KB = 1024

/**
 * Binary size-unit constants for file limits, buffers, and memory costs.
 */
export const FileSize = {
  BytesInGb: BYTES_IN_KB ** 3,
  BytesInKb: BYTES_IN_KB,
  BytesInMb: BYTES_IN_KB ** 2,
  KbInMb: BYTES_IN_KB,
  MbInGb: BYTES_IN_KB
} as const
export type FileSize = ValueOf<typeof FileSize>
