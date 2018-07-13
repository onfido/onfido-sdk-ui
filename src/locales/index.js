import Polyglot from 'node-polyglot'

import en from './en.json'
import es from './es.json'
import enMobile from './mobilePhrases/en.json'
import esMobile from './mobilePhrases/es.json'
import { isDesktop, parseTags } from '../components/utils'

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
  const newTranslationsSet = new Set(customKeys)
  const missingKeys =  defaultKeys.filter(element => !newTranslationsSet.has(element))
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
  if (typeof(language) === 'string') {
    return trySupportedLanguage(language, polyglot)
  }
  return useCustomTranslations(language, polyglot)
}

export const initializeI18n = (language) => {
  const polyglot = defaultLanguage()
  if (!language) return polyglot
  return overrideTranslations(language, polyglot) || polyglot
}

export const parseI18nWithXmlTags = (i18n, translationKey, handleTag) => parseTags(i18n.t(translationKey), handleTag)
