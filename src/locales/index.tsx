import { h, createContext, FunctionComponent, ComponentType } from 'preact'
import { useContext } from 'preact/compat'
import { parseTags } from '~utils'
import initializePolyglot from './polyglot'

import type { WithLocalisedProps } from '~types/hocs'
import type {
  SupportedLanguages,
  LocaleConfig,
  TranslatedTagParser,
} from '~types/locales'

type ProviderProps = {
  language?: SupportedLanguages | LocaleConfig
}

export const LocaleContext = createContext<WithLocalisedProps | undefined>(
  undefined
)

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

export const useLocales = (): WithLocalisedProps => {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error(`LocaleContext hasn't been initialized!`)
  }

  return context
}

export const localised = <P extends unknown>(
  WrappedComponent: ComponentType<P & WithLocalisedProps>
): ComponentType<P> => {
  const LocalisedComponent: FunctionComponent<P> = (props) => (
    <LocaleContext.Consumer>
      {(injectedProps) => {
        if (injectedProps == null) {
          throw new Error(`LocaleContext hasn't been initialized!`)
        }

        return <WrappedComponent {...props} {...injectedProps} />
      }}
    </LocaleContext.Consumer>
  )

  return LocalisedComponent
}
