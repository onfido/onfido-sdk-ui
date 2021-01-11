import * as globals from './globals'
import * as captures from './captures'
import { RESET_STORE } from '../../constants'
import type { ActionCreatorType } from '../../types'

const reset: ActionCreatorType<unknown> = (payload) => ({
  type: RESET_STORE,
  payload,
})

export const actions = { ...globals, ...captures, reset }
