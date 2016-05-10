import {bindActionCreators} from 'redux'
import objectAssign from 'object-assign'
import store from '../store'
import * as globals from './globals'
import * as captures from './captures'

export const unboundActions = objectAssign({}, globals, captures)
export const actions = bindActionCreators(unboundActions, store.dispatch)
