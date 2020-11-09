// @flow
import type { Node, ComponentType } from 'react'
import { h, createContext } from 'preact'
import { parseTags } from '~utils'
import initializePolyglot from './polyglot'

const LocaleContext = createContext({})

type ProviderProps = {
  language: string,
  children: Node,
}

export const LocaleProvider = ({ language, children }: ProviderProps) => {
  const polyglot = initializePolyglot(language)
  const translate = polyglot.t.bind(polyglot)
  const parseTranslatedTags = (key, handler) => parseTags(translate(key), handler)

  return (
    <LocaleContext.Provider value={{language: polyglot.currentLocale, translate, parseTranslatedTags}}>
      {children}
    </LocaleContext.Provider>
  )
}

export type LocalisedType = {
  translate: (string, ?{}) => string,
  parseTranslatedTags: (string, { text: string } => Node) => Node,
  language: string,
}

export const localised = <Props: *>(Wrapped: ComponentType<Props>): ComponentType<{...LocalisedType, ...Props}> => {
  const LocalisedComponent = (props: Props) => (
    <LocaleContext.Consumer>
      {(injectedProps: LocalisedType) => <Wrapped {...props} {...injectedProps} />}
    </LocaleContext.Consumer>
  )

  return LocalisedComponent
}
