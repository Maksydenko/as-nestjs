import { Time } from './shared/enums'

/**
 * Global request limit per throttler window.
 */
export const THROTTLE_LIMIT_PER_MINUTE = 60

/**
 * Default throttler window length.
 */
export const THROTTLE_TTL_MS = Time.MillisecondsInMinute
