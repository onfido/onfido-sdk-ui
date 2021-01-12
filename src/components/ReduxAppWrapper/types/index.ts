import { CaptureActions, CaptureState } from './captures'
import { GlobalActions, GlobalState } from './globals'

type RootState = CaptureState | GlobalState

export { CaptureActions, GlobalActions, RootState }
