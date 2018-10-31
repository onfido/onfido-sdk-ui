export const find = (obj = {}, fn) =>
  Array.find(Object.keys(obj), key => fn(obj[key], key))

export const omit = (obj = {}, keys = []) =>
  Object.keys(obj).reduce((accum, key) => {
    if (!Array.includes(keys, key)) {
      accum[key] = obj[key]
    }
    return accum
  }, {})

export const findKey = (obj = {}, fn) =>
  Array.find(Object.keys(obj), key => fn(obj[key], key))

export const isEmpty = (obj = {}) => Object.keys(obj).length === 0
