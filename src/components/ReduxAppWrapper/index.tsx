import { h, Component } from 'preact'
import { createStore } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'
import reducer from './store/reducers'
import type { /* CaptureActions, GlobalActions, */ RootState } from './types'

type Props = Record<string, unknown>

class ReduxAppWrapper extends Component<Props> {
  private store: Store<RootState>
  constructor(props: Props) {
    super(props)
    this.store = createStore<RootState>(
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
