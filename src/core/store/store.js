import { createStore } from 'redux'
import reducer from './reducers'

const store = createStore(reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : undefined
)

export default store
