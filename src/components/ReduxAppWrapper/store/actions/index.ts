import type { Action } from 'redux'
import * as constants from '~types/redux/constants'
import * as globals from './globals'
import * as captures from './captures'

const reset = (): Action<typeof constants.RESET_STORE> => ({
  type: constants.RESET_STORE,
})

export const actions = { ...globals, ...captures, reset }
