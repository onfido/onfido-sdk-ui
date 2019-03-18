export const find = (obj = {}, fn) =>
  Array.find(Object.keys(obj), key => fn(obj[key], key))

export const pick = (obj, keys = []) =>
  omitBy(obj, key => !Array.includes(keys, key))
export const pickBy = (obj, rule) =>
  omitBy(obj, (...args) => !rule(...args))
export const omit = (obj, keys = []) =>
  omitBy(obj, key => Array.includes(keys, key))
export const omitBy = (obj, rule) =>
  Object.keys(obj || {}).reduce((accum, key) => {
    if (!rule(key, obj[key])) {
      accum[key] = obj[key]
    }
    return accum
  }, {})

export const findKey = (obj = {}, fn) =>
  Array.find(Object.keys(obj), key => fn(obj[key], key))

export const isEmpty = (obj = {}) => Object.keys(obj).length === 0
