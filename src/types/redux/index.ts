import { CaptureState } from './captures'
import { GlobalState } from './globals'

export * from './captures'
export * from './globals'

export type RootState = {
  captures: CaptureState
  globals: GlobalState
}
