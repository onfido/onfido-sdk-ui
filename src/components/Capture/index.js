import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'
import withOptions from './withOptions'

export const DocumentFrontCapture = appendToTracking(
  withOptions(Document),
  'front_capture'
)
export const DocumentBackCapture = appendToTracking(
  withOptions(Document, { side: 'back' }),
  'back_capture'
)
export const SelfieCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'standard' }),
  'selfie_capture'
)
export const VideoCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'video' }),
  'video_capture'
)
export const PoADocumentCapture = appendToTracking(
  withOptions(Document, { isPoA: true, forceCrossDevice: false }),
  'poa'
)
