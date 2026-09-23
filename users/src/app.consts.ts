import { Time } from './shared/enums'

/**
 * Global request limit per throttler window.
 */
export const THROTTLE_LIMIT_PER_MINUTE = 60

/**
 * Default throttler window length.
 */
export const THROTTLE_TTL_MS = Time.MillisecondsInMinute

/**
 * Default Redis cache TTL for CacheModule when set() omits an explicit TTL.
 */
export const DEFAULT_CACHE_TTL_MS = 10 * Time.MillisecondsInMinute
