import * as Polyglot from 'node-polyglot'
import en_US from './en_US/en_US.json'
import { isDesktop } from '~utils'
import { LocaleConfig, SupportedLanguages } from '~types/locales'
import { useEffect, useState } from 'preact/hooks'
import { trackException } from 'Tracker'

const defaultLocaleTag = 'en_US'

interface LocaleTypeObj {
  [key: string]: Record<string, unknown>
}

type TranslationType = Record<string, LocaleTypeObj>

// Note: We're extending because we're using private Polyglot vars
class PolyglotExtended extends Polyglot {
  phrases?: unknown
  currentLocale: SupportedLanguages | LocaleConfig['locale'] = defaultLocaleTag
}

// English is bundled as fallback, other langauges are loaded dynamically
const files = {
  en_US: () => Promise.resolve(en_US),
  es_ES: () =>
    import(/* webpackChunkName: "lang_es_ES" */ './es_ES/es_ES.json'),
  de_DE: () =>
    import(/* webpackChunkName: "lang_de_DE" */ './de_DE/de_DE.json'),
  fr_FR: () =>
    import(/* webpackChunkName: "lang_fr_FR" */ './fr_FR/fr_FR.json'),
  it_IT: () =>
    import(/* webpackChunkName: "lang_it_IT" */ './it_IT/it_IT.json'),
  pt_PT: () =>
    import(/* webpackChunkName: "lang_pt_PT" */ './pt_PT/pt_PT.json'),
  nl_NL: () =>
    import(/* webpackChunkName: "lang_nl_NL" */ './nl_NL/nl_NL.json'),
}

// Language tags should follow the IETF's BCP 47 guidelines, link below:
// https://www.w3.org/International/questions/qa-lang-2or3
// Generally it should be a two or three charaters tag (language) followed by a two/three characters subtag (region), if needed.
const availableTranslations = {
  en_US: files.en_US,
  en: files.en_US,
  es_ES: files.es_ES,
  es: files.es_ES,
  de_DE: files.de_DE,
  de: files.de_DE,
  fr_FR: files.fr_FR,
  fr: files.fr_FR,
  it_IT: files.it_IT,
  it: files.it_IT,
  pt_PT: files.pt_PT,
  pt: files.pt_PT,
  nl_NL: files.nl_NL,
  nl: files.nl_NL,
}

const createDefaultPolyglot = (): PolyglotExtended => {
  const polyglot = new Polyglot({
    onMissingKey: (key) => {
      // The empty onMissingKey hides missing keys instead of being display in front-end
      if (process.env.NODE_ENV === 'development') {
        console.error(`The locale ${key} is missing`)
      }
      return ''
    },
  }) as PolyglotExtended

  return extendPolyglot(polyglot, en_US, en_US?.mobilePhrases, 'en_US')
}

const updatePolyglot = async (
  polyglot: PolyglotExtended,
  language?: SupportedLanguages | LocaleConfig
) => {
  if (!language) {
    return polyglot
  }

  const nonDefaultLocale =
    typeof language === 'string' ? language : language.locale

  if (nonDefaultLocale && availableTranslations[nonDefaultLocale]) {
    await loadSupportedLanguage(nonDefaultLocale, polyglot)
  }

  if (typeof language !== 'string') {
    await withCustomLanguage(language, polyglot)
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
  return getPhrasesFromPolyglot(polyglot)
}

const getPhrasesFromPolyglot = (polyglot: PolyglotExtended): string[] => {
  return polyglot?.phrases ? Object.keys(polyglot?.phrases as object) : []
}

const verifyKeysPresence = (
  customLanguageConfig: LocaleConfig,
  polyglot: PolyglotExtended
) => {
  const { phrases, mobilePhrases } = customLanguageConfig
  const defaultKeys = getPhrasesFromPolyglot(polyglot)
  // Currently mobilePhrases can be passed inside the phrases object or as a separate object.
  // Only return the warning for missing keys if mobilePhrases are not present in phrases or as a separate object.
  const customMobilePhrases = Object.assign(
    {},
    phrases?.mobilePhrases,
    mobilePhrases
  )
  const customKeys = polyglotFormatKeys({
    ...phrases,
    mobilePhrases: customMobilePhrases as TranslationType,
  })
  findMissingKeys(defaultKeys, customKeys, customLanguageConfig?.locale)
}

const withCustomLanguage = async (
  customLanguageConfig: LocaleConfig,
  polyglot: PolyglotExtended
): Promise<PolyglotExtended> => {
  const { locale, phrases, mobilePhrases } = customLanguageConfig
  verifyKeysPresence(customLanguageConfig, polyglot)
  return extendPolyglot(polyglot, phrases, mobilePhrases, locale)
}

const loadSupportedLanguage = async (
  language: SupportedLanguages,
  polyglot: PolyglotExtended
): Promise<PolyglotExtended | undefined> => {
  if (!availableTranslations[language]) {
    return polyglot
  }

  let translations
  try {
    translations = await availableTranslations[language]()
  } catch (e) {
    console.error(e)
    trackException(`Could not load locale file: ${language}`)
    return polyglot
  }

  return extendPolyglot(
    polyglot,
    translations,
    translations?.mobilePhrases,
    language
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

type UsePolyglotState = {
  polyglot: PolyglotExtended
  loading: boolean
}

export const usePolyglot = (
  language?: SupportedLanguages | LocaleConfig
): UsePolyglotState => {
  const [{ polyglot, loading }, setState] = useState<UsePolyglotState>({
    polyglot: createDefaultPolyglot(),
    loading: true,
  })

  useEffect(() => {
    const setup = async () => {
      setState((state) => ({ ...state, loading: true }))
      let polyglot = createDefaultPolyglot()
      polyglot = await updatePolyglot(polyglot, language)
      setState((state) => ({ ...state, polyglot, loading: false }))
    }

    setup()
  }, [language])

  return { polyglot, loading }
}
