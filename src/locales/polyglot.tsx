import * as Polyglot from 'node-polyglot'
import * as en_US from './en_US/en_US.json'
import * as es_ES from './es_ES/es_ES.json'
import * as de_DE from './de_DE/de_DE.json'
import * as fr_FR from './fr_FR/fr_FR.json'
import * as it_IT from './it_IT/it_IT.json'
import * as pt_PT from './pt_PT/pt_PT.json'
import * as nl_NL from './nl_NL/nl_NL.json'
import { isDesktop } from '~utils'
import { memoize } from '~utils/func'
import { LocaleConfig, SupportedLanguages } from '~types/locales'

const defaultLocaleTag = 'en_US'

interface LocaleTypeObj {
  [key: string]: Record<string, unknown>
}

type TranslationType = Record<string, LocaleTypeObj>

// Note: We're extending because we're using private Polyglot vars
class PolyglotExtended extends Polyglot {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  phrases?: any
  currentLocale: SupportedLanguages | LocaleConfig['locale'] = defaultLocaleTag
}

const defaultTranslationWithNoRegion: TranslationType = {
  en: en_US,
  es: es_ES,
  de: de_DE,
  fr: fr_FR,
  it: it_IT,
  pt: pt_PT,
  nl: nl_NL,
}

// Language tags should follow the IETF's BCP 47 guidelines, link below:
//https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
const availableTranslations: TranslationType = {
  ...defaultTranslationWithNoRegion,
  en_US,
  es_ES,
  de_DE,
  fr_FR,
  it_IT,
  pt_PT,
  nl_NL,
}

const mobilePhrases = (): LocaleTypeObj => {
  const phrases: LocaleTypeObj = {}
  for (const lang in availableTranslations) {
    if ({}.hasOwnProperty.call(availableTranslations, lang)) {
      phrases[lang] = availableTranslations[lang].mobilePhrases
    }
  }
  return phrases
}

const mobileTranslations = mobilePhrases()

const defaultLanguage = () => {
  const polyglot = new Polyglot({
    // Note: The empty onMissingKey hides missing keys instead of being display in front-end
    // @ts-ignore
    onMissingKey: (key) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(`The locale ${key} is missing`)
      }
    },
  }) as PolyglotExtended
  return extendPolyglot(
    polyglot,
    availableTranslations[defaultLocaleTag],
    mobileTranslations[defaultLocaleTag],
    defaultLocaleTag
  )
}

const extendPolyglot = (
  polyglot: PolyglotExtended,
  phrases: LocaleConfig['phrases'],
  mobilePhrases: LocaleConfig['mobilePhrases'],
  locale?: SupportedLanguages
): PolyglotExtended => {
  polyglot.locale(locale)
  polyglot.extend(phrases)
  if (!isDesktop) {
    polyglot.extend(mobilePhrases)
  }
  return polyglot
}

const findMissingKeys = (
  defaultKeys: string[],
  customKeys: string[],
  customLocale: LocaleConfig['locale']
): void => {
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

const polyglotFormatKeys = (phrases: TranslationType): string[] => {
  const polyglot = new Polyglot({ phrases }) as PolyglotExtended
  return Object.keys(polyglot?.phrases)
}

const verifyKeysPresence = (
  customLanguageConfig: LocaleConfig,
  polyglot: PolyglotExtended
) => {
  const { phrases, mobilePhrases } = customLanguageConfig
  const defaultKeys = Object.keys(polyglot.phrases)
  // Currently mobilePhrases can be passed inside the phrases object or as a separate object.
  // Only return the warning for missing keys if mobilePhrases are not present in phrases or as a separate object.
  const customMobilePhrases = Object.assign(
    {},
    phrases.mobilePhrases,
    mobilePhrases
  )
  const customKeys = polyglotFormatKeys({
    ...phrases,
    mobilePhrases: customMobilePhrases as TranslationType,
  })
  findMissingKeys(defaultKeys, customKeys, customLanguageConfig?.locale)
}

const trySupportedLanguage = (
  polyglot: PolyglotExtended,
  language?: SupportedLanguages
): PolyglotExtended | undefined => {
  if (language && availableTranslations[language]) {
    return extendPolyglot(
      polyglot,
      availableTranslations[language],
      mobileTranslations[language],
      language
    )
  }
  console.warn('Locale not supported')
}

const withCustomLanguage = (
  customLanguageConfig: LocaleConfig,
  polyglot: PolyglotExtended
): PolyglotExtended => {
  const { locale, phrases, mobilePhrases } = customLanguageConfig
  verifyKeysPresence(customLanguageConfig, polyglot)
  const newPolyglot = trySupportedLanguage(polyglot, locale) || polyglot
  return extendPolyglot(newPolyglot, phrases, mobilePhrases, locale)
}

const overrideTranslations = (
  language: SupportedLanguages | LocaleConfig,
  polyglot: PolyglotExtended
): PolyglotExtended | undefined => {
  if (typeof language === 'string') {
    return trySupportedLanguage(polyglot, language)
  }
  return withCustomLanguage(language, polyglot)
}

export default memoize(
  (language: SupportedLanguages | LocaleConfig): PolyglotExtended => {
    const polyglot = defaultLanguage()
    if (!language) return polyglot
    return overrideTranslations(language, polyglot) || polyglot
  }
)
