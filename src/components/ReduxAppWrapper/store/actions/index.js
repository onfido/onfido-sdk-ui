import * as globals from './globals'
import * as captures from './captures'
import { RESET_STORE } from '../../constants'

const reset = payload => ({ type: RESET_STORE, payload })

export const actions = {...globals, ...captures, reset}
