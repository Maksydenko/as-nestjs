import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions
} from 'class-validator'

/**
 * Validates that the decorated property equals another property on the same object.
 *
 * @param property - Name of the sibling property to compare against (e.g. `password`).
 * @param validationOptions - Optional class-validator options.
 */
export const Match =
  (property: string, validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [property],
      name: 'match',
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as [string]
          const relatedValue = (args.object as Record<string, unknown>)[
            relatedPropertyName
          ]

          return value === relatedValue
        }
      }
    })
  }
