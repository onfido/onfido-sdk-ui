import { h } from 'preact'
import type { ErrorNames, ErrorTypes } from './commons'
import type { CapturePayload } from './redux'

export type HandleCaptureProp = (payload: CapturePayload) => void

export type ErrorProp = {
  name: ErrorNames
  type?: ErrorTypes
}

export type RenderFallbackProp = (
  text: string,
  callback?: () => void
) => h.JSX.Element
