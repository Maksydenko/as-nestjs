import type { ValueOf } from '../types'

/**
 * Output formats for libphonenumber-js `PhoneNumber.format`.
 */
export const PhoneFormat = {
  E164: 'E.164',
  IDD: 'IDD',
  International: 'INTERNATIONAL',
  National: 'NATIONAL',
  Rfc3966: 'RFC3966'
} as const
export type PhoneFormat = ValueOf<typeof PhoneFormat>
