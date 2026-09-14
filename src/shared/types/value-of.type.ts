/**
 * Union of all property value types for object type `T`.
 *
 * @typeParam T - Object type with string or symbol keys.
 */
export type ValueOf<T> = T[keyof T]
