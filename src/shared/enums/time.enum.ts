import type { ValueOf } from '../types'

const DAYS_IN_WEEK = 7
const HOURS_IN_DAY = 24
const MINUTES_IN_HOUR = 60
const SECONDS_IN_MINUTE = 60
const MILLISECONDS_IN_SECOND = 1000

/**
 * Time-unit constants for durations, intervals, and scheduling.
 */
export const Time = {
  DaysInWeek: DAYS_IN_WEEK,
  HoursInDay: HOURS_IN_DAY,
  MillisecondsInDay:
    HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND,
  MillisecondsInMinute: SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND, // 60_000
  MillisecondsInSecond: MILLISECONDS_IN_SECOND,
  MillisecondsInWeek:
    DAYS_IN_WEEK *
    HOURS_IN_DAY *
    MINUTES_IN_HOUR *
    SECONDS_IN_MINUTE *
    MILLISECONDS_IN_SECOND,
  MinutesInHour: MINUTES_IN_HOUR,
  SecondsInMinute: SECONDS_IN_MINUTE
} as const
export type Time = ValueOf<typeof Time>
