// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { createContext } from 'preact-context'
import { initializeI18n } from './index.js'

const LocaleContext = createContext({})

type Props = {
  language: string,
  children: React.Node,
}

export const LocaleProvider = ({ language, children }: Props) => {
  const i18n = initializeI18n(language)
  const translate = i18n.t.bind(i18n)
  return <LocaleContext.Provider value={{ language, translate }}>
    {children}
  </LocaleContext.Provider>
}

type InjectedProps = {
  translate: string => string,
  language: string,
}

export const localised = <WrappedProps: *>(
  WrappedComponent: React.ComponentType<WrappedProps>
): React.ComponentType<WrappedProps & InjectedProps> =>
  (wrappedProps: WrappedProps) =>
    <LocaleContext.Consumer>{
      (injectedProps: InjectedProps) => <WrappedComponent {...wrappedProps} {...injectedProps} />
    }
    </LocaleContext.Consumer>