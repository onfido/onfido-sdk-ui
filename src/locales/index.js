import { h, createContext } from 'preact'
import { parseTags } from '~utils'
import initializePolyglot from './polyglot'

const LocaleContext = createContext({})

/* type ProviderProps = {
  language: string,
  children: Node,
} */

export const LocaleProvider = ({ language, children }) => {
  const polyglot = initializePolyglot(language)
  const translate = polyglot.t.bind(polyglot)
  const parseTranslatedTags = (key, handler) => parseTags(translate(key), handler)

  return (
    <LocaleContext.Provider value={{language: polyglot.currentLocale, translate, parseTranslatedTags}}>
      {children}
    </LocaleContext.Provider>
  )
}

/* export type LocalisedType = {
  translate: (string, ?{}) => string,
  parseTranslatedTags: (string, { text: string } => Node) => Node,
  language: string,
} */

export const localised = (Wrapped) => {
  const LocalisedComponent = (props) => (
    <LocaleContext.Consumer>
      {(injectedProps) => <Wrapped {...props} {...injectedProps} />}
    </LocaleContext.Consumer>
  )

  return LocalisedComponent
}
