import {
  isPhoneNumber,
  registerDecorator,
  type ValidationOptions
} from 'class-validator'
import { parsePhoneNumberFromString } from 'libphonenumber-js/min'

import { PhoneFormat } from '../enums'

export const IsStrictPhoneNumber =
  (validationOptions?: ValidationOptions): PropertyDecorator =>
  (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isStrictPhoneNumber',
      options: { message: 'Invalid phone number', ...validationOptions },
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || !isPhoneNumber(value)) {
            return false
          }

          const phone = parsePhoneNumberFromString(value)

          if (!phone?.isValid()) {
            return false
          }

          const e164 = phone.format(PhoneFormat.E164)
          // Allow only formatting chars in input: spaces, (), . and -
          const compact = value.replace(/[\s().-]/g, '')

          return compact === e164
        }
      }
    })
  }
