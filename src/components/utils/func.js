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

export const counter = function *(start = 0, end = 10, increment = 1) {
  let current = start
  while (true){
    if ( (increment > 0 && current > end) || (increment < 0 && current < end)){
      yield end
    }
    else {
      yield current
      current += increment
    }
  }
}
