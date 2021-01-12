import { h, Component, VNode } from 'preact'
import { createStore, Store } from 'redux'
import { Provider as ReduxProvider } from 'react-redux'
import reducer, { RootState } from './store/reducers'
import type { CaptureActions, GlobalActions } from './types'

type Props = {
  children: VNode
}

class ReduxAppWrapper extends Component<Props> {
  private store: Store<RootState, CaptureActions | GlobalActions>

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
