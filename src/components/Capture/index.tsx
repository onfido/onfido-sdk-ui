import { h, ComponentType, FunctionComponent } from 'preact'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'

const withOptions = <P extends unknown>(
  WrappedComponent: ComponentType<P>,
  additionalProps: P = {} as P
): ComponentType<P> => {
  const WithOptionComponent: FunctionComponent<P> = (optionsAsProps) => (
    <WrappedComponent {...optionsAsProps} {...additionalProps} />
  )
  return WithOptionComponent
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
  'document_video_capture'
)
export const FaceSelfieCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'standard' }),
  'selfie_capture'
)
export const FaceVideoCapture = appendToTracking(
  withOptions(Face, { requestedVariant: 'video' }),
  'face_video_capture'
)
export const PoACapture = appendToTracking(
  withOptions(Document, { isPoA: true, forceCrossDevice: false }),
  'poa'
)
