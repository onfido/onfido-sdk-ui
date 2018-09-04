export const find = (obj = {}, fn) =>
  Object.keys(obj).find(key => fn(obj[key], key))

export const omit = (obj = {}, keys = []) =>
  Object.keys(obj).reduce((accum, key) => {
    if (!Array.includes(keys, key)) {
      accum[key] = obj[key]
    }
    return accum
  }, {})