import { combineReducers } from 'redux'
import { captures } from './captures'
import globals from './globals'

export default combineReducers({
  captures,
  globals
})
