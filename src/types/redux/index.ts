import { CaptureActions, CaptureState } from './captures'
import { GlobalActions, GlobalState } from './globals'

export * from './captures'
export * from './globals'

export type CombinedActions = CaptureActions | GlobalActions

export type RootState = {
  captures: CaptureState
  globals: GlobalState
}
