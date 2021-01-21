import type { ErrorNames, ErrorTypes } from './commons'
import type { CapturePayload } from './redux'

export type HandleCaptureProp = (payload: CapturePayload) => void

export type ErrorProp = {
  name: ErrorNames
  type?: ErrorTypes
}
