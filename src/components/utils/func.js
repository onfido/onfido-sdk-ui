export const asyncFunc = (fn, args, callback) =>
  tick(()=>callback(fn(...args)))

export const tick = fn =>
  requestAnimationFrame(fn)

export const identity = val => val

export const compose = (...fns) =>
  fns.reduceRight((prev, next) => (...args) => next(prev(...args)), identity)

export const constant = val => () => val

