import { registerDecorator, type ValidationOptions } from 'class-validator'
import tlds from 'tlds'
import isEmail from 'validator/lib/isEmail'

export const IsValidTld =
  (validationOptions?: ValidationOptions): PropertyDecorator =>
  (object: object, propertyName: string) => {
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
