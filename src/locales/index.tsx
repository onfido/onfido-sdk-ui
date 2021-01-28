import { h, createContext, FunctionComponent, ComponentType } from 'preact'
import { parseTags } from '~utils'
import initializePolyglot from './polyglot'

import type { WithLocalisedProps } from '~types/hocs'
import type {
  SupportedLanguages,
  LocaleConfig,
  TranslatedTagParser,
} from '~types/locales'

type ProviderProps = {
  language: SupportedLanguages | LocaleConfig
}

export const LocaleContext = createContext<WithLocalisedProps>(null)

export const LocaleProvider: FunctionComponent<ProviderProps> = ({
  language,
  children,
}) => {
  const polyglot = initializePolyglot(language)
  const translate = polyglot.t.bind(polyglot)
  const parseTranslatedTags: TranslatedTagParser = (key, handler) =>
    parseTags(translate(key), handler)

  return (
    <LocaleContext.Provider
      value={{
        language: polyglot.currentLocale,
        translate,
        parseTranslatedTags,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

export const localised = <P extends unknown>(
  WrappedComponent: ComponentType<P & WithLocalisedProps>
): ComponentType<P> => {
  const LocalisedComponent: FunctionComponent<P> = (props) => (
    <LocaleContext.Consumer>
      {(injectedProps) => <WrappedComponent {...props} {...injectedProps} />}
    </LocaleContext.Consumer>
  )

  return LocalisedComponent
}
