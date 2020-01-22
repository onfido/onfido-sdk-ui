import { h, Component } from 'preact'
import { Provider as ReduxProvider } from 'react-redux'
import reducer from './store/reducers'
import { createStore } from 'redux'

class ReduxAppWrapper extends Component {
  constructor(props) {
    super(props)
    this.store = createStore(reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined
    )
  }
  
  render() {
    return (
      <ReduxProvider store={this.store}>
        {this.props.children}
      </ReduxProvider>
    )
  }
}

export default ReduxAppWrapper