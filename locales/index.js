import Polyglot from 'node-polyglot'

import {en} from './en'
import {es} from './es'
import {en as enMobile} from './mobileLocales/en'
import {es as esMobile} from './mobileLocales/es'
import { isDesktop } from '../src/components/utils'

const defaultLocaleTag = 'en'

// Language tags should follow the IETF's BCP 47 guidelines, link below:
//https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
const availableTransations = {en, es}

const mobileTranslations = {
  en: enMobile,
  es: esMobile
}

const unsupportedLocaleTag = () => {
  console.warn('Locale not supported')
  return defaultLocaleTag
}

const localeTag = (language) => {
  if (!language) return defaultLocaleTag
  return availableTransations[language] ? language : unsupportedLocaleTag()
}

export const initializeI18n = (language) => {
  const locale = localeTag(language)
  const phrases = availableTransations[locale]
  const polyglot = new Polyglot({locale, phrases, onMissingKey: () => null})
  if (!isDesktop) polyglot.extend(mobileTranslations[locale])
  return polyglot
}
