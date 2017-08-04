export const cleanFalsy = list => Array.filter(list, n => n)
export const wrapArray = maybeArray => Array.isArray(maybeArray) ? maybeArray : [maybeArray]
