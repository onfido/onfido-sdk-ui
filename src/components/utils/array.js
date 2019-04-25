export const cleanFalsy = list => list.filter(n => n)

export const wrapArray = maybeArray => Array.isArray(maybeArray) ? maybeArray : [maybeArray]

export const flatten = (...values) =>
  values.reduce((accum, arr) => accum.concat(...wrapArray(arr)), [])

export const includes = (arr, value) => arr.filter(item => value === item).length > 0
