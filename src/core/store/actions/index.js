import { bindActionCreators } from 'redux'
import store from '../store'
import * as globals from './globals'
import * as captures from './captures'

export const unboundActions = {...globals, ...captures}
export const actions = bindActionCreators(unboundActions, store.dispatch)
