import { bindActionCreators } from 'redux'
import store from '../store'
import * as globals from './globals'
import * as captures from './captures'
import { RESET_STORE } from '../../constants'

const reset = payload => ({ type: RESET_STORE, payload })

export const unboundActions = {...globals, ...captures, reset}
export const actions = bindActionCreators(unboundActions, store.dispatch)
