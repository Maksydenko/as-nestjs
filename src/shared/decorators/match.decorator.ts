import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions
} from 'class-validator'

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
