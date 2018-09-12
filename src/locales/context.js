// @flow
import * as React from 'react'
import { h, Component } from 'preact'
import { createContext } from 'preact-context'
import { initializeI18n } from './index.js'

const LocaleContext = createContext()

type Props = {
  language: string,
  children: React.Node,
}

type State = {
  i18n: { t: string => string },
}

export class LocaleProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      i18n: initializeI18n(props.language),
    }
  }

  componentWillUpdate(nextProps: Props) {
    if (nextProps.language !== this.props.language) {
      this.setState({
        i18n: initializeI18n(nextProps.language)
      })
    }
  }

  render() {
    const { i18n } = this.state
    const { language, children } = this.props
    const translate = i18n.t.bind(i18n)
    return (
      <LocaleContext.Provider value={{ language, translate }}>
        {children}
      </LocaleContext.Provider>
    )
  }
}

type InjectedProps = {
  translate: string => string,
  language: string,
}

export const localised = <WrappedProps: *>(
  WrappedComponent: React.ComponentType<WrappedProps>
): React.ComponentType<WrappedProps & InjectedProps> =>
  (props: WrappedProps) =>
    <LocaleContext.Consumer>{
      (moreProps: InjectedProps) => <WrappedComponent {...props} {...moreProps} />
    }
    </LocaleContext.Consumer>