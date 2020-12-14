export type SupportedLanguages =
  | 'en_US'
  | 'en'
  | 'de_DE'
  | 'de'
  | 'es_ES'
  | 'es'
  | 'fr_FR'
  | 'fr'

export interface LocaleConfig {
  language?: SupportedLanguages
  phrases: Record<string, unknown>
  mobilePhrases?: Record<string, unknown>
}
