import Polyglot from 'node-polyglot'
import forEach from 'object-loops/for-each'

import {en} from './en'
import {es} from './es'
import {en as enMobile} from './mobileLocales/en'
import {es as esMobile} from './mobileLocales/es'
import { isDesktop } from '../components/utils'

const defaultLocaleTag = 'en'

// Language tags should follow the IETF's BCP 47 guidelines, link below:
//https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
const availableTransations = {en, es}

const mobileTranslations = {
  en: enMobile,
  es: esMobile
}

const defaultLanguage = () => {
  const polyglot = new Polyglot({locale: defaultLocaleTag, phrases: availableTransations[defaultLocaleTag] , onMissingKey: () => null})
  if (!isDesktop) polyglot.extend(mobileTranslations[defaultLocaleTag])
  return polyglot
}


const extendPolyglot = (locale, polyglot, phrases, mobilePhrases) => {
  polyglot.locale(locale)
  polyglot.extend(phrases)
  if (!isDesktop) { polyglot.extend(mobilePhrases) }
  return polyglot
}

const findMissingKeys = (defaultKeys, customKeys) => {
  const missingKeys = []
  forEach(defaultKeys, (key) => {
    if (!customKeys.includes(key)) {
      missingKeys.push(key)
    }
  })
  if (missingKeys.length) { console.warn('Missing keys:', missingKeys) }
}

const flattenKeys = (phrases, prefix = '') => {
  return Object.keys(phrases).reduce((result, key) => {
    if (Array.isArray(phrases[key]) ) {
      return result
    }
    if (phrases[key] !== null && typeof(phrases[key]) === 'object' ) {
      return [...result, ...flattenKeys(phrases[key], prefix + key + '.')]
    }
    return [...result, prefix + key]
  }, []);
}

const verifyKeysPresence = (phrases, polyglot) => {
  const defaultKeys = Object.keys(polyglot.phrases)
  const customKeys = flattenKeys(phrases)
  findMissingKeys(defaultKeys, customKeys)
}


const overrideTranslations = (language, polyglot) => {
  let extendedPolyglot = ''
  if (typeof(language) === 'string') {
    if (availableTransations[language]) {
      extendedPolyglot = extendPolyglot(language, polyglot, availableTransations[language], mobileTranslations[language])
    }
    else {
      console.warn('Locale not supported')
    }
  }
  else if (language.locale) {
    verifyKeysPresence(language.phrases, polyglot)
    extendedPolyglot = extendPolyglot(language.locale, polyglot, language.phrases, language.mobilePhrases)
  }
  return extendedPolyglot
}

export const initializeI18n = (language) => {
  const polyglot = defaultLanguage()
  if (!language) return polyglot
  return overrideTranslations(language, polyglot) || polyglot
}
