import { combineReducers } from 'redux'
import type { RootState } from '../../types'
import captures from './captures'
import globals from './globals'

const appReducer = combineReducers<RootState>({
  captures,
  globals,
})

export default appReducer
