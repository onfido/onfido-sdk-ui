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
export const DocumentVideoCapture = appendToTracking(
  withOptions(Document, { requestedVariant: 'video' }),
  'document_video_capture'
)

export const PoACapture = appendToTracking(
  withOptions(Document, { isPoA: true, forceCrossDevice: false }),
  'poa'
)

export const FaceSelfieCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'standard' }),
  'selfie_capture'
)
export const FaceVideoCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'video' }),
  'face_video_capture'
)
