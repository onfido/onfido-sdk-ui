export const cleanFalsy = list => Array.filter(list, n => n)

export const wrapArray = maybeArray => Array.isArray(maybeArray) ? maybeArray : [maybeArray]

export const flatten = (...values) =>
  values.reduce((accum, arr) => accum.concat(...wrapArray(arr)), [])

export const last = arr => arr[arr.length - 1]
