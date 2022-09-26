import { identity } from './func'
import { cleanFalsy, flatten } from './array'

type StringConverter = (str: string) => string

const CAMELCASE_REGEX = /([A-Z])/g
const WORD_SPLIT_REGEX = /[^\s_-]+/g

const firstUpper: StringConverter = (str) =>
  str.substr(0, 1).toUpperCase() + str.substr(1)

const unCamel = (str: string): string[] =>
  str.replace(CAMELCASE_REGEX, ' $1').split(' ')

export const lowerCase = (str?: string): string => (str || '').toLowerCase()

export const upperCase = (str?: string): string => (str || '').toUpperCase()

const asWordsList = (str: string): string[] => {
  const list = ((str || '').match(WORD_SPLIT_REGEX) || []).map(unCamel)
  const compactedList = cleanFalsy(flatten(list))
  return compactedList.map(lowerCase)
}

export const camelCase: StringConverter = (str) =>
  asWordsList(str).reduce(
    (accum, word, index) =>
      `${accum}${(index > 0 ? firstUpper : identity)(word)}`,
    ''
  )

export const kebabCase: StringConverter = (str) => asWordsList(str).join('-')

export const snakeCase: StringConverter = (str) => asWordsList(str).join('_')

export const startCase: StringConverter = (str) =>
  asWordsList(str).map(firstUpper).join(' ')

export const humanCase: StringConverter = (str) =>
  firstUpper(asWordsList(str).join(' '))

export const randomId = (): string => Math.random().toString(36).substring(7)

export const includesRegex = (string: string, regex: RegExp): boolean =>
  !!string.match(regex)

export const isOnfidoHostname = (url: string): boolean =>
  includesRegex(url, /^https:\/\/[A-Za-z0-9.]*\.?onfido\.com$/g)
