import type { Action } from 'redux'
import * as globals from './globals'
import * as captures from './captures'
import * as constants from '../../constants'

const reset = (): Action<typeof constants.RESET_STORE> => ({
  type: constants.RESET_STORE,
})

export const actions = { ...globals, ...captures, reset }
