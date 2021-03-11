import Polyglot from 'node-polyglot'
import en_US from './en_US/en_US.json'
import es_ES from './es_ES/es_ES.json'
import de_DE from './de_DE/de_DE.json'
import fr_FR from './fr_FR/fr_FR.json'
import { isDesktop } from '~utils'
import { memoize } from '~utils/func'

const defaultLocaleTag = 'en_US'

const defaultTranslationWithNoRegion = {
  en: en_US,
  es: es_ES,
  de: de_DE,
  fr: fr_FR,
}

// Language tags should follow the IETF's BCP 47 guidelines, link below:
//https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
const availableTranslations = {
  ...defaultTranslationWithNoRegion,
  en_US,
  es_ES,
  de_DE,
  fr_FR,
}

const mobilePhrases = () => {
  const phrases = {}
  for (const lang in availableTranslations) {
    if ({}.hasOwnProperty.call(availableTranslations, lang)) {
      phrases[lang] = availableTranslations[lang].mobilePhrases
    }
  }
  return phrases
}

const mobileTranslations = mobilePhrases()

const defaultLanguage = () => {
  const polyglot = new Polyglot({ onMissingKey: () => null })
  return extendPolyglot(
    defaultLocaleTag,
    polyglot,
    availableTranslations[defaultLocaleTag],
    mobileTranslations[defaultLocaleTag]
  )
}

const extendPolyglot = (locale, polyglot, phrases, mobilePhrases) => {
  polyglot.locale(locale)
  polyglot.extend(phrases)
  if (!isDesktop) {
    polyglot.extend(mobilePhrases)
  }
  return polyglot
}

const findMissingKeys = (defaultKeys, customKeys, customLocale) => {
  const newTranslationsSet = new Set(customKeys)
  const missingKeys = defaultKeys.filter(
    (element) => !newTranslationsSet.has(element)
  )
  const isSupportedLanguage = Object.keys(availableTranslations).some(
    (supportedLanguage) => supportedLanguage === customLocale
  )
  if (missingKeys.length && !isSupportedLanguage) {
    console.warn('Missing keys:', missingKeys)
  }
}

const polyglotFormatKeys = (phrases) =>
  Object.keys(new Polyglot({ phrases }).phrases)

const verifyKeysPresence = (customLanguageConfig, polyglot) => {
  const { phrases, mobilePhrases } = customLanguageConfig
  const defaultKeys = Object.keys(polyglot.phrases)
  // Currently mobilePhrases can be passed inside the phrases object or as a separate object.
  // Only return the warning for missing keys if mobilePhrases are not present in phrases or as a separate object.
  const customMobilePhrases = { ...phrases.mobilePhrases, ...mobilePhrases }
  const customKeys = polyglotFormatKeys({
    ...phrases,
    mobilePhrases: customMobilePhrases,
  })
  findMissingKeys(defaultKeys, customKeys, customLanguageConfig?.locale)
}

const trySupportedLanguage = (language, polyglot) => {
  if (availableTranslations[language]) {
    return extendPolyglot(
      language,
      polyglot,
      availableTranslations[language],
      mobileTranslations[language]
    )
  }
  console.warn('Locale not supported')
}

const withCustomLanguage = (customLanguageConfig, polyglot) => {
  const { locale, phrases, mobilePhrases } = customLanguageConfig
  verifyKeysPresence(customLanguageConfig, polyglot)
  const newPolyglot = trySupportedLanguage(locale, polyglot) || polyglot
  return extendPolyglot(locale, newPolyglot, phrases, mobilePhrases)
}

const overrideTranslations = (language, polyglot) => {
  if (typeof language === 'string') {
    return trySupportedLanguage(language, polyglot)
  }
  return withCustomLanguage(language, polyglot)
}

export default memoize((language) => {
  const polyglot = defaultLanguage()
  if (!language) return polyglot
  return overrideTranslations(language, polyglot) || polyglot
})
