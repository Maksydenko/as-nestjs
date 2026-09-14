import { parsePhoneNumberFromString } from 'libphonenumber-js/min'

import { PhoneFormat } from '../enums'

/**
 * Parses a phone string and returns it in E.164 when valid; otherwise returns the input unchanged.
 *
 * @param value - Raw phone number from the client or database.
 * @returns E.164 string (e.g. `+380951234567`) or the original `value` if parsing fails.
 */
export const normalizePhoneToE164 = (value: string): string => {
  const phone = parsePhoneNumberFromString(value)

  if (!phone?.isValid()) {
    return value
  }

  return phone.format(PhoneFormat.E164)
}
