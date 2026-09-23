import { Transform } from 'class-transformer'

/**
 * Lowercases string values during transformation; leaves non-strings unchanged.
 */
export const ToLowerCase = (): PropertyDecorator =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase() : value
  )
