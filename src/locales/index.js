// @flow
import * as React from 'react'
import { h } from 'preact'
import { createContext } from 'preact-context'
import { parseTags } from '../components/utils'
import initializePolyglot from './polyglot'

const LocaleContext = createContext({})

type Props = {
  language: string,
  children: React.Node,
}

export const LocaleProvider = ({ language, children }: Props) => {
  const polyglot = initializePolyglot(language)
  const translate = polyglot.t.bind(polyglot)
  const parseTranslatedTags = (key, handler) => parseTags(translate(key), handler)

  return (
    <LocaleContext.Provider value={{ language, translate, parseTranslatedTags }}>
      {children}
    </LocaleContext.Provider>
  )
}

export type LocalisedType = {
  translate: (string, ?{}) => string,
  parseTranslatedTags: (string, { text: string } => React.Node) => React.Node,
  language: string,
}

export const localised = <WrappedProps: *>(
  WrappedComponent: React.ComponentType<WrappedProps>
): React.ComponentType<{ ...LocalisedType, ...WrappedProps}> =>
  (wrappedProps: WrappedProps) =>
    <LocaleContext.Consumer>{
      (injectedProps: LocalisedType) => <WrappedComponent {...wrappedProps} {...injectedProps} />
    }
    </LocaleContext.Consumer>

