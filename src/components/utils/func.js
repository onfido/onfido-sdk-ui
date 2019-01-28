export const identity = val => val

export const compose = (...fns) =>
  fns.reduceRight((prev, next) => (...args) => next(prev(...args)), identity)

export const memoize = fn => {
  const cache = {}
  return (...args) => {
    const key = JSON.stringify(args)
    return cache[key] || (cache[key] = fn(...args))
  }
}

export const constant = val => () => val

export const noop = () => {}
