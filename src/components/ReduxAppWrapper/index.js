import { h, Component } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import reducer from './store/reducers'
import { createStore, bindActionCreators } from 'redux'
import * as globals from './store/actions/globals'
import * as captures from './store/actions/captures'
import { RESET_STORE } from './constants'

class ReduxAppWrapper extends Component {
  constructor(props) {
    super(props)
    this.store = createStore(reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined
    )
    const reset = payload => ({ type: RESET_STORE, payload })
    this.unboundActions = {...globals, ...captures, reset}
    this.actions = bindActionCreators(this.unboundActions, this.store.dispatch)
  }
  
  render({options, childComponent}) {
    const ChildComponent = childComponent
    return (
      <ReduxProvider store={this.store}>
        <ChildComponent options={options} actions={this.actions}/>
      </ReduxProvider>
    )
  }
}

export default ReduxAppWrapper