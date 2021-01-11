import { h, Component } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import reducer from './store/reducers'
import { createStore } from 'redux'

type Props = Record<string, unknown>

class ReduxAppWrapper extends Component<Props> {
  constructor(props: Props) {
    super(props)
    this.store = createStore(
      reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : undefined
    )
  }

  render(): h.JSX.Element {
    return (
      <ReduxProvider store={this.store}>{this.props.children}</ReduxProvider>
    )
  }
}

export default ReduxAppWrapper
