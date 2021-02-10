export const cleanFalsy = <T>(
  list: Array<T | null | undefined | boolean>
): Array<T | boolean> => list.filter((n) => n)

export const wrapArray = (maybeArray: unknown): Array<unknown> =>
  Array.isArray(maybeArray) ? maybeArray : [maybeArray]

type NonArray<T> = T extends Array<unknown> ? never : T

export const flatten = <T>(...values: T[]): Array<NonArray<T>> =>
  values.reduce((accum, arr) => accum.concat(...wrapArray(arr)), [])
