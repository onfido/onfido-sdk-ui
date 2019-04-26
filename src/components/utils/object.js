export const findKey = (obj = {}, fn) =>
  Object.keys(obj).find(key => fn(obj[key], key))

export const pick = (obj, keys = []) =>
  omitBy(obj, key => !keys.includes(key))
export const pickBy = (obj, rule) =>
  omitBy(obj, (...args) => !rule(...args))
export const omit = (obj, keys = []) =>
  omitBy(obj, key => keys.includes(key))
export const omitBy = (obj, rule) =>
  Object.keys(obj || {}).reduce((accum, key) => {
    if (!rule(key, obj[key])) {
      accum[key] = obj[key]
    }
    return accum
  }, {})

export const isEmpty = (obj = {}) => Object.keys(obj).length === 0

export const map = (obj, fn) =>
  Object.assign({},...Object.entries(obj).map(
    ([k, v]) => ({ [k]: fn(v, k) })
  ));

export const forEach = (obj, fn) =>
  Object.entries(obj).forEach(
    ([k, v]) => fn(v,k)
  );
