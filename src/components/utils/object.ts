// @TODO: replace this over-generic method with something easier to maintain
export const findKey = <K extends string, V>(
  obj: Partial<Record<K, V>> = {},
  fn: (value: V, key: K) => boolean
  // @ts-ignore
): K => Object.keys(obj).find((key) => fn(obj[key], key))

export const shallowEquals = <K extends string, V>(
  objA: Partial<Record<K, V>>,
  objB: Partial<Record<K, V>>
): boolean => {
  if (!objA && !objB) return true
  if ((!objA && objB) || (objA && !objB)) return false

  const aKeys = Object.keys(objA) as K[]
  const bKeys = Object.keys(objB) as K[]
  const allKeys = new Set(aKeys.concat(bKeys))

  if (aKeys.length !== bKeys.length || aKeys.length !== allKeys.size)
    return false

  for (let i = 0; i < aKeys.length; i++) {
    if (objA[aKeys[i]] !== objB[aKeys[i]]) return false
  }

  return true
}

export const pick = <K extends string, U extends string, V>(
  obj: Partial<Record<K | U, V>> | null,
  keys: K[] = []
  // @ts-ignore
): Record<K, V> => omitBy(obj, (key) => !keys.includes(key))

export const pickBy = <K extends string, V>(
  obj: Partial<Record<K, V>>,
  rule: (key: K, value: V) => boolean
): Partial<Record<K, V>> => omitBy(obj, (...args) => !rule(...args))

export const omit = <K extends string, U extends string, V>(
  obj: Partial<Record<K | U, V>> | null,
  keys: K[] = []
  // @ts-ignore
): Record<U, V> => omitBy(obj, (key) => keys.includes(key))

export const omitBy = <K extends string, V>(
  obj: Partial<Record<K, V>> | null,
  rule: (key: K, value: V) => boolean
): Partial<Record<K, V>> => {
  return (Object.keys(obj || {}) as K[]).reduce((accum, key) => {
    // @ts-ignore
    if (obj && !rule(key, obj[key])) {
      accum[key] = obj[key]
    }

    return accum
  }, {} as Partial<Record<K, V>>)
}

export const isEmpty = (obj: Record<string, unknown> = {}): boolean =>
  Object.keys(obj).length === 0

export const map = <K extends string, V, T>(
  obj: Partial<Record<K, V>>,
  fn: (value: V, key: K) => T
): Record<K, T> =>
  Object.assign(
    {},
    ...(Object.entries(obj) as Array<[K, V]>).map(([key, value]) => ({
      [key]: fn(value, key),
    }))
  )

export const forEach = <K extends string, V>(
  obj: Partial<Record<K, V>>,
  fn: (value: V, key: K) => void
): void => (Object.entries(obj) as Array<[K, V]>).forEach(([k, v]) => fn(v, k))
