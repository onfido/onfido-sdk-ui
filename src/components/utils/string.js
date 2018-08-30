import { identity, compose } from './func'
import { cleanFalsy, flatten } from './array'

const firstUpper = str => str.substr(0, 1).toUpperCase() + str.substr(1)

const lower = str => str.toLowerCase()

const camelCaseRe = /([A-Z])/g

const unCamel = str => str.replace(camelCaseRe, ' $1').split(' ')

const compactFlat = compose(cleanFalsy, flatten)

const wordSplitRe = /[^\s_\-]+/g

const asWordsList = str =>
  compactFlat(((str || '').match(wordSplitRe) || []).map(unCamel)).map(lower)

export const camelCase = str => asWordsList(str).reduce((accum, word, index) =>
   `${ accum }${ (index > 0 ? firstUpper : identity)(word) }`, '')

export const kebabCase = str => asWordsList(str).join('-')

export const snakeCase = str => asWordsList(str).join('_')

export const startCase = str => asWordsList(str).map(firstUpper).join(' ')

export const humanCase = str => firstUpper(asWordsList(str).join(' '))

export const randomId = () => Math.random().toString(36).substring(7)
