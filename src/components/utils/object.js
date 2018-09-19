export const find = (obj = {}, fn) =>
  Array.find(Object.keys(obj), key => fn(obj[key], key))

export const mapValues = (obj = {}, fn) =>
  Object.keys(obj).reduce((accum, key) =>
    ({ ...accum, [key]: fn(obj[key], key) }), {})

export const map = (obj = {}, fn) =>
  Object.keys(obj).map(key => fn(obj[key], key))