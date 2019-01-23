export const find = (obj = {}, fn) =>
  Array.find(Object.keys(obj), key => fn(obj[key], key))

export const shallowEquals = (objA, objB) => {
  if (!objA && !objB) return true
  if (!objA && objB || objA && !objB) return false

  const aKeys = Object.keys(objA)
  const bKeys = Object.keys(objB)
  const allKeys = new Set(aKeys.concat(bKeys))
  if (aKeys.length !== bKeys.length || aKeys.length !== allKeys.size) return false

  for (let i = 0; i < aKeys.length; i++) {
    if (objA[aKeys[i]] !== objB[aKeys[i]]) return false
  }

  return true
}

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
