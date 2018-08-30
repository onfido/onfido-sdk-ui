import { combineReducers } from 'redux'
import { capture } from './capture'
import globals from './globals'
import { RESET_STORE } from '../../constants'

const appReducer = combineReducers({
  capture,
  globals
})

export default (state, action) => {
  if (action.type === RESET_STORE) {
    return appReducer({}, {})
  }
  return appReducer(state, action)
}
