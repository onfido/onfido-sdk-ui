import { h } from 'preact'
import { connect } from 'react-redux'

import { buildCaptureStateKey } from '~utils/redux'
import { appendToTracking, trackComponentAndMode } from '../../Tracker'
import { localised } from '~locales'
import Confirm, { ConfirmProps } from './Confirm'
import { RootState } from '~types/redux'

const mapStateToProps = (
  { captures, globals: { isFullScreen, imageQualityRetries } }: RootState,
  { method, side }: ConfirmProps
) => ({
  capture: captures[buildCaptureStateKey({ method, side })],
  isFullScreen,
  imageQualityRetries,
})

const TrackedConfirmComponent = trackComponentAndMode(
  Confirm,
  'confirmation',
  'error'
)

//@ts-ignore
const MapConfirm = connect(mapStateToProps)(localised(TrackedConfirmComponent))

const PoAFrontWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="poa" side="front" />
)

const DocumentFrontWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="document" side="front" />
)

const DocumentBackWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="document" side="back" />
)

const BaseFaceConfirm = (props: ConfirmProps) => (
  <MapConfirm {...props} method="face" />
)

const DocumentFrontConfirm = appendToTracking(DocumentFrontWrapper, 'front')
const DocumentBackConfirm = appendToTracking(DocumentBackWrapper, 'back')
const SelfieConfirm = appendToTracking(BaseFaceConfirm, 'selfie')
const FaceVideoConfirm = appendToTracking(BaseFaceConfirm, 'face_video')
const PoAConfirm = appendToTracking(PoAFrontWrapper, 'poa')

export {
  DocumentFrontConfirm,
  DocumentBackConfirm,
  SelfieConfirm,
  FaceVideoConfirm,
  PoAConfirm,
}
