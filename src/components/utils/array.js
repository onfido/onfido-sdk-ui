export const cleanFalsy = list => list.filter(n => n)

export const wrapArray = maybeArray => Array.isArray(maybeArray) ? maybeArray : [maybeArray]

export const flatten = (...values) =>
  values.reduce((accum, arr) => accum.concat(...wrapArray(arr)), [])
