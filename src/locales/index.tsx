import {
  h,
  createContext,
  FunctionComponent,
  ComponentType,
  ComponentChildren,
  Fragment,
} from 'preact'
import { useContext } from 'preact/compat'
import { parseTags } from '~utils'
import { usePolyglot } from './polyglot'

import type { WithLocalisedProps } from '~types/hocs'
import type {
  SupportedLanguages,
  LocaleConfig,
  TranslatedTagParser,
} from '~types/locales'
import Spinner from 'components/Spinner'

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
  const { polyglot, loading } = usePolyglot(language)
  const translate = polyglot.t.bind(polyglot)
  const parseTranslatedTags: TranslatedTagParser = (key, handler) =>
    parseTags(translate(key), handler)

  return (
    <LocaleContext.Provider
      value={{
        language: polyglot?.currentLocale,
        translate,
        parseTranslatedTags,
        loading,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
}

type LocaleLoaderProps = {
  shouldAutoFocus?: boolean
  children: ComponentChildren
}
export const LocaleLoader = ({
  shouldAutoFocus,
  children,
}: LocaleLoaderProps) => {
  const context = useContext(LocaleContext)

  if (context?.loading) {
    return <Spinner shouldAutoFocus={shouldAutoFocus} />
  }

  return <Fragment>{children}</Fragment>
}

export const useLocales = (): WithLocalisedProps => {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error(`LocaleContext hasn't been initialized!`)
  }

  return context
}

export const localised = <P,>(
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
