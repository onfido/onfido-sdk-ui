import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'
import withCaptureVariant from './withCaptureVariant'

export const DocumentFrontCapture = appendToTracking(
  withCaptureVariant(Document),
  'front_capture'
)
export const DocumentBackCapture = appendToTracking(
  withCaptureVariant(Document, { side: 'back' }),
  'back_capture'
)
export const DocumentVideoCapture = appendToTracking(
  withCaptureVariant(Document, { requestedVariant: 'video' }),
  'document_video_capture'
)

export const PoACapture = appendToTracking(
  withCaptureVariant(Document, { isPoA: true, forceCrossDevice: false }),
  'poa'
)

export const SelfieCapture = appendToTracking(
  withCaptureVariant(Face, { requestedVariant: 'standard' }),
  'selfie_capture'
)
export const FaceVideoCapture = appendToTracking(
  withCaptureVariant(Face, { requestedVariant: 'video' }),
  'face_video_capture'
)
