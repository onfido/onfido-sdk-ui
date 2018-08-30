export const find = (obj = {}, fn) =>
  Object.keys(obj).find(key => fn(obj[key], key))