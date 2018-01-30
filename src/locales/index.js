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

const missingKeyWarn = (defaultKeys, extendedPolyglot) => {
  forEach(defaultKeys, (key) => {
    if (!(key in extendedPolyglot.phrases)) {
      console.warn(`Missing key: ${key}`)
    }
  })
}

const flattenKeys = (obj, prefix = '') => {
  return Object.keys(obj).reduce((res, el) => {
    if( Array.isArray(obj[el]) ) {
      return res;
    } else if( obj[el] !== null && typeof(obj[el]) === 'object' ) {
      return [...res, ...keyify(obj[el], prefix + el + '.')];
    } else {
      return [...res, prefix + el];
    }
  }, []);
}

// const verifyKeysPresence = () => {
//   flattenKeys()
// }


const overrideTranslations = (language, polyglot) => {
  const defaultKeys = Object.keys(polyglot.phrases)
  let extendedPolyglot = ''
  if (typeof(language) === 'string') {
    if (availableTransations[language]) {
      extendedPolyglot = extendPolyglot(language, availableTransations[language], mobileTranslations[language])
      // missingKeyWarn(defaultKeys, extendedPolyglot)
    }
    else {
      console.warn('Locale not supported')
    }
  }
  else if (language.locale) {
    verifyKeysPresence()
    extendedPolyglot = extendPolyglot(language.locale, language.phrases, language.mobilePhrases)
    // missingKeyWarn(defaultKeys, extendedPolyglot)
  }
  return extendedPolyglot
}

export const initializeI18n = (language) => {
  const polyglot = defaultLanguage()
  if (!language) return polyglot
  return overrideTranslations(language, polyglot) || polyglot
}
