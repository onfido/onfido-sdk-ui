export const asyncFunc = (fn, args, callback) =>
  tick(()=>callback(fn(...args)))

export const tick = fn =>
  requestAnimationFrame(fn)

export const identity = val => val
