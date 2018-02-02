import Polyglot from 'node-polyglot'

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
  const polyglot = new Polyglot({onMissingKey: () => null})
  return extendPolyglot(defaultLocaleTag, polyglot, availableTransations[defaultLocaleTag], mobileTranslations[defaultLocaleTag] )
}


const extendPolyglot = (locale, polyglot, phrases, mobilePhrases) => {
  polyglot.locale(locale)
  polyglot.extend(phrases)
  if (!isDesktop) { polyglot.extend(mobilePhrases) }
  return polyglot
}

const findMissingKeys = (defaultKeys, customKeys) => {
  const newTransaltionsSet = new Set(customKeys)
  const missingKeys =  defaultKeys.filter(element => !newTransaltionsSet.has(element))
  if (missingKeys.length) { console.warn('Missing keys:', missingKeys) }
}

const polyglotFormatKeys = (phrases) =>
  Object.keys(new Polyglot({phrases}).phrases)

const verifyKeysPresence = (phrases, polyglot) => {
  const defaultKeys = Object.keys(polyglot.phrases)
  const customKeys = polyglotFormatKeys(phrases)
  findMissingKeys(defaultKeys, customKeys)
}

const trySupportedLanguage = (language, polyglot) => {
  if (availableTransations[language]) {
    return extendPolyglot(language, polyglot, availableTransations[language], mobileTranslations[language])
  }
  console.warn('Locale not supported')
}

const useCustomTranslations = (language, polyglot) => {
  verifyKeysPresence(language.phrases, polyglot)
  const newPolyglot = trySupportedLanguage(language.locale, polyglot) || polyglot
  return extendPolyglot(language.locale, newPolyglot, language.phrases, language.mobilePhrases)
}

const overrideTranslations = (language, polyglot) => {
  let extendedPolyglot = ''
  if (typeof(language) === 'string') {
    extendedPolyglot = trySupportedLanguage(language, polyglot)
  }
  else if (language.locale) {
    extendedPolyglot = useCustomTranslations(language, polyglot)
  }
  return extendedPolyglot
}

export const initializeI18n = (language) => {
  const polyglot = defaultLanguage()
  if (!language) return polyglot
  return overrideTranslations(language, polyglot) || polyglot
}
