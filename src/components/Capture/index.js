import { h } from 'preact'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'

const withOptions = (WrappedComponent, additionalProps = {}) => {
  const OptionedComponent = (optionsAsProps) => (
    <WrappedComponent {...optionsAsProps} {...additionalProps} />
  )
  return OptionedComponent
}

export const DocumentFrontCapture = appendToTracking(
  withOptions(Document),
  'front_capture'
)
export const DocumentBackCapture = appendToTracking(
  withOptions(Document, { side: 'back' }),
  'back_capture'
)
export const DocumentVideoCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'video' }),
  'video_capture'
)
export const FaceSelfieCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'standard' }),
  'selfie_capture'
)
export const FaceVideoCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'video' }),
  'video_capture'
)
export const PoACapture = appendToTracking(
  withOptions(Document, { isPoA: true, forceCrossDevice: false }),
  'poa'
)
