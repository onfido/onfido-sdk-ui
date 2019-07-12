import { identity, compose } from './func'
import { cleanFalsy, flatten } from './array'

const firstUpper = str => str.substr(0, 1).toUpperCase() + str.substr(1)

const camelCaseRe = /([A-Z])/g

const unCamel = str => str.replace(camelCaseRe, ' $1').split(' ')

const compactFlat = compose(cleanFalsy, flatten)

const wordSplitRe = /[^\s_-]+/g

export const lowerCase = str => (str || '').toLowerCase()

export const upperCase = str => (str || '').toUpperCase()

const asWordsList = str =>
  compactFlat(((str || '').match(wordSplitRe) || []).map(unCamel)).map(lowerCase)

export const camelCase = str => asWordsList(str).reduce((accum, word, index) =>
   `${ accum }${ (index > 0 ? firstUpper : identity)(word) }`, '')

export const kebabCase = str => asWordsList(str).join('-')

export const snakeCase = str => asWordsList(str).join('_')

export const startCase = str => asWordsList(str).map(firstUpper).join(' ')

export const humanCase = str => firstUpper(asWordsList(str).join(' '))

export const randomId = () => Math.random().toString(36).substring(7)

export const includesRegex = (string, regex) => !!string.match(regex)


/*
Tested pass against:
https://api.onfido.com/v2/documents
https://onfido.com/v2/documents
https://cross.onfido.com/v2/documents
https://cross.lol.onfido.com/v2/documents

Tested fail against:
https://revolut.com/v2/documents/?url=https://onfido.com", /https:\/\/[A-Za-z0-9\.]*\.?onfido\.com/g
https://onfido.revolut.com/v2/documents
https://onfido.revolut.com/v2/documents/onfido.com
 */
export const isOnfidoHostname = (url) => includesRegex(url,/^https:\/\/[A-Za-z0-9.]*\.?onfido\.com$/g)
