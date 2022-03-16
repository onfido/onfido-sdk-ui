export const identity = <T>(val: T): T => val

export const constant = <T>(val: T) => (): T => val

type ComposeFunction<T> = (param: T) => T

export const compose = <T>(...fns: ComposeFunction<T>[]): ComposeFunction<T> =>
  fns.reduceRight((prev, next) => (...args) => next(prev(...args)), identity)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MemoizeFunction<T> = (...params: any[]) => T

export const memoize = <T>(fn: MemoizeFunction<T>): MemoizeFunction<T> => {
  const cache: Record<string, T> = {}

  return (...args: unknown[]) => {
    const key = JSON.stringify(args)
    return cache[key] || (cache[key] = fn(...args))
  }
}

export const noop = (): void => {} // eslint-disable-line @typescript-eslint/no-empty-function
