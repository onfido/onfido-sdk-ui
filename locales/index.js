import Polyglot from 'node-polyglot'

import {en} from './en'
import {es} from './es'
import {en as enMobile} from './mobileLocales/en'
import {es as esMobile} from './mobileLocales/es'
import { isDesktop } from '../src/components/utils'

const defaultLocale = 'en'

// Language tags should follow the IETF's BCP 47 guidelines, link below:
//https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
const locales = {en, es}

const mobileLocales = {
  en: enMobile,
  es: esMobile
}

const unsupportedLocale = () => {
  console.warn('Locale not supported')
  return defaultLocale
}

const setLocale = (language) => {
  if (!language) return defaultLocale
  return locales[language] ? language : unsupportedLocale()
}

export const setI18n = (language) => {
  const locale = setLocale(language)
  const phrases = locales[locale]
  const polyglot = new Polyglot({locale, phrases, onMissingKey: () => null})
  if (!isDesktop) polyglot.extend(mobileLocales[locale])
  return polyglot
}
