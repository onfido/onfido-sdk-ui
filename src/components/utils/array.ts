// @TODO: replace this over-generic method with something easier to maintain
export const cleanFalsy = <T>(list: Array<T | null | undefined>): Array<T> =>
  // @ts-ignore
  list.filter((n) => n)

type ArrayAlways<T> = T extends Array<unknown> ? T : T[]

export const wrapArray = <T>(maybeArray: T): ArrayAlways<T> =>
  Array.isArray(maybeArray)
    ? (maybeArray as ArrayAlways<T>)
    : ([maybeArray] as ArrayAlways<T>)

export const flatten = <T>(values: T[][]): T[] =>
  values.reduce((accum, arr) => accum.concat(...wrapArray(arr)), [])

export const notEmpty = <TValue>(
  value: TValue | null | undefined
): value is TValue => {
  return value !== null && value !== undefined
}
