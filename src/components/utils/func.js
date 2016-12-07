export const asyncFunc = (fn, args, callback) =>
  tick(()=>callback(fn(...args)))

export const tick = fn =>
  requestAnimationFrame(fn)

export const timeFunc = func => {
  const t0 = performance.now();
  const result = func();
  const t1 = performance.now();
  return {result, time: t1 - t0};
}
