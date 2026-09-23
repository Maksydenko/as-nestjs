import { registerDecorator, type ValidationOptions } from 'class-validator'
import tlds from 'tlds'
import isEmail from 'validator/lib/isEmail'

/**
 * When the value looks like an email, requires its domain TLD to be in the public TLD list.
 * Non-email values are treated as valid so other validators can own that check.
 *
 * @param validationOptions - Optional class-validator options.
 */
export const IsValidTld =
  (validationOptions?: ValidationOptions): PropertyDecorator =>
  (object: object, propertyName: string | symbol) => {
    if (typeof propertyName !== 'string') {
      return
    }

    registerDecorator({
      name: 'isValidTld',
      options: { message: 'Invalid email', ...validationOptions },
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string' || !isEmail(value)) {
            return true
          }

          const domain = value.split('@')[1]?.toLowerCase()
          const tld = domain.split('.').at(-1)

          return !!(tld && tlds.includes(tld))
        }
      }
    })
  }
