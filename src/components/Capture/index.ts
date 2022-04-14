import { WithTrackingProps } from '~types/hocs'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'
import withCaptureVariant from './withCaptureVariant'

export const DocumentFrontCapture = appendToTracking(
  withCaptureVariant(Document, { side: 'front', requestedVariant: 'standard' }),
  'front_capture'
)
export const DocumentBackCapture = appendToTracking(
  withCaptureVariant(Document, { side: 'back', requestedVariant: 'standard' }),
  'back_capture'
)
export const DocumentVideoCapture = appendToTracking(
  withCaptureVariant(Document, { side: 'front', requestedVariant: 'video' }),
  'document_video_capture'
)

export const PoACapture = appendToTracking(
  withCaptureVariant(Document, {
    isPoA: true,
    forceCrossDevice: false,
    side: 'front',
  }),
  'poa'
)

export const SelfieCapture = appendToTracking(
  withCaptureVariant(Face, {
    requestedVariant: 'standard',
    pageId: 'SelfieCapture',
  }),
  'selfie_capture'
)
export const FaceVideoCapture = appendToTracking(
  withCaptureVariant(Face, {
    requestedVariant: 'video',
    pageId: 'FaceVideoCapture',
  }),
  'face_video_capture'
)
