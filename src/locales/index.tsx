import { h, createContext, FunctionComponent, ComponentType, VNode } from 'preact'
import { parseTags } from '~utils'
import initializePolyglot from './polyglot'

import type { SupportedLanguages, LocaleConfig, TranslatedTagParser } from '~types/locales'

type ProviderProps = {
  language: SupportedLanguages | LocaleConfig
  children: VNode
}

export const LocaleProvider: FunctionComponent<ProviderProps> = ({ language, children }) => {
  const polyglot = initializePolyglot(language)
  const translate = polyglot.t.bind(polyglot)
  const parseTranslatedTags: TranslatedTagParser = (key, handler) => parseTags(translate(key), handler)

  return (
    <LocaleContext.Provider value={{language: polyglot.currentLocale, translate, parseTranslatedTags}}>
      {children}
    </LocaleContext.Provider>
  )
}

export type LocalisedType = {
  language: SupportedLanguages
  parseTranslatedTags: TranslatedTagParser
  translate: (key: string, options?: Record<string, unknown>) => string
}

const LocaleContext = createContext<LocalisedType>(null)

export const localised = <P extends unknown>(WrappedComponent: ComponentType<P & LocalisedType>): ComponentType<P> => {
  const LocalisedComponent: FunctionComponent<P> = (props) => (
    <LocaleContext.Consumer>
      {(injectedProps) => <WrappedComponent {...props} {...injectedProps} />}
    </LocaleContext.Consumer>
  )

  return LocalisedComponent
}
