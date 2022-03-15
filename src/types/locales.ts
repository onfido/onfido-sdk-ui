import { h } from 'preact'

export type SupportedLanguages =
  | 'en_US'
  | 'en'
  | 'de_DE'
  | 'de'
  | 'es_ES'
  | 'es'
  | 'fr_FR'
  | 'fr'
  | 'it_IT'
  | 'it'
  | 'pt_PT'
  | 'pt'
  | 'nl_NL'
  | 'nl'

export type LocaleConfig = {
  locale?: SupportedLanguages
  phrases: Record<string, unknown>
  mobilePhrases?: Record<string, unknown>
}

export type ParsedElement = string | h.JSX.Element | null

export type ParsedTag = {
  type: string
  text: string
}

export type TranslatedTagHandler = (tag: ParsedTag) => ParsedElement

export type TranslatedTagParser = (
  key: string,
  handler: TranslatedTagHandler
) => ParsedElement[]

export type TranslateCallback = (
  key: string,
  options?: Record<string, unknown>
) => string
