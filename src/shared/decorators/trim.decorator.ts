import { Transform } from 'class-transformer'

/**
 * Trims leading and trailing whitespace from string values during transformation.
 */
export const Trim = (): PropertyDecorator =>
  Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value
  )
