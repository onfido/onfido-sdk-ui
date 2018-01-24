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

const setLocaleTag = (language) => {
  if (!language) return defaultLocaleTag
  const {locale} = language
  return availableTransations[locale] || language.phrases ? locale : unsupportedLocaleTag()
}

export const setI18n = (language) => {
  const localeTag = setLocaleTag(language)
  const phrases = language && language.phrases ? language.phrases : availableTransations[localeTag]
  const polyglot = new Polyglot({localeTag, phrases, allowMissing: false})
  if (!isDesktop) polyglot.extend(mobileTranslations[localeTag] || language.phrases.mobileTranslations)
  return polyglot
}
