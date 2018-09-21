export const findKey = (obj = {}, fn) =>
  Array.find(Object.keys(obj), key => fn(obj[key], key))

export const isEmpty = (obj = {}) => Object.keys(obj).length === 0