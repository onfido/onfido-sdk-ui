import Polyglot from 'node-polyglot'
import en_US from './en_US/en_US.json'
import es_ES from './es_ES/es_ES.json'
import de_DE from './de_DE/de_DE.json'
import fr_FR from './fr_FR/fr_FR.json'
import { isDesktop } from '~utils'
import { memoize } from '~utils/func'

const defaultLocaleTag = 'en_US'

// Language tags should follow the IETF's BCP 47 guidelines, link below:
//https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
const availableTransations = {en_US, es_ES, de_DE, fr_FR}

const mobilePhrases = () => {
  const phrases = {}
  for (let lang in availableTransations) {
    if ({}.hasOwnProperty.call(availableTransations, lang)) {
      phrases[lang] = availableTransations[lang].mobilePhrases
    }
  }
  return phrases
}

const mobileTranslations = mobilePhrases()

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

const findMissingKeys = (defaultKeys, customKeys, language) => {
  const newTranslationsSet = new Set(customKeys)
  const missingKeys =  defaultKeys.filter(element => !newTranslationsSet.has(element))
  const isSupportedLanguage = Object.keys(availableTransations).some((supportedLanguage) => supportedLanguage === language)
  if (missingKeys.length && !isSupportedLanguage) {
    console.warn('Missing keys:', missingKeys)
  }
}

const polyglotFormatKeys = (phrases) =>
  Object.keys(new Polyglot({phrases}).phrases)

const verifyKeysPresence = (phrases, polyglot, language) => {
  const defaultKeys = Object.keys(polyglot.phrases)
  const customKeys = polyglotFormatKeys(phrases)
  findMissingKeys(defaultKeys, customKeys, language)
}

const trySupportedLanguage = (language, polyglot) => {
  if (availableTransations[language]) {
    return extendPolyglot(language, polyglot, availableTransations[language], mobileTranslations[language])
  }
  console.warn('Locale not supported')
}

const useCustomTranslations = (language, polyglot) => {
  verifyKeysPresence(language.phrases, polyglot, language.locale)
  const newPolyglot = trySupportedLanguage(language.locale, polyglot) || polyglot
  return extendPolyglot(language.locale, newPolyglot, language.phrases, language.mobilePhrases)
}

const findLanguageKey = (language) => {
  for (let key in availableTransations) {
    if ({}.hasOwnProperty.call(availableTransations, key) && key.startsWith(language)) {
      return key
    }
  }
}

const overrideTranslations = (language, polyglot) => {
  if (typeof(language) === 'string') {
    const lang = findLanguageKey(language)
    return trySupportedLanguage(lang, polyglot)
  }
  return useCustomTranslations(language, polyglot)
}

export default memoize(language => {
  const polyglot = defaultLanguage()
  if (!language) return polyglot
  return overrideTranslations(language, polyglot) || polyglot
})
