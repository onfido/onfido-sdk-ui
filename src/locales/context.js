import { h, Component } from 'preact'
import { createContext } from 'preact-context'
import { initializeI18n } from './index.js'

const LocaleContext = createContext()

export class LocaleProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      i18n: initializeI18n(props.language),
    }
  }

  componentWillUpdate(nextProps) {
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

export const localised = WrappedComponent =>
  props =>
    <LocaleContext.Consumer>{
      moreProps => <WrappedComponent {...props} {...moreProps} />
    }
    </LocaleContext.Consumer>