import { combineReducers } from 'redux'
import { captures } from './captures'
import globals from './globals'
import * as constants from '../../constants'

const appReducer = combineReducers({
  captures,
  globals
})

export default (state, action) => {
  if (action.type === constants.RESET_STORE) {
    return appReducer({}, {})
  }
  return appReducer(state, action)
}
