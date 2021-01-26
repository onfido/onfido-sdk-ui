import { h } from 'preact'
import { connect } from 'react-redux'

import { buildCaptureStateKey } from '~utils/redux'
import { trackComponentAndMode, appendToTracking } from '../../Tracker'
import { localised } from '../../locales'
import Confirm from './Confirm'

const mapStateToProps = (state, { method, side, variant }) => ({
  capture: state.captures[buildCaptureStateKey({ method, side, variant })],
  isFullScreen: state.globals.isFullScreen,
  imageQualityRetries: state.globals.imageQualityRetries,
})

const TrackedConfirmComponent = trackComponentAndMode(
  Confirm,
  'confirmation',
  'error'
)

const MapConfirm = connect(mapStateToProps)(localised(TrackedConfirmComponent))

const DocumentFrontWrapper = (props) => (
  <MapConfirm {...props} method="document" side="front" />
)

const DocumentBackWrapper = (props) => (
  <MapConfirm {...props} method="document" side="back" />
)

const DocumentVideoWrapper = (props) => (
  <MapConfirm {...props} method="document" variant="video" />
)

const BaseFaceConfirm = (props) => <MapConfirm {...props} method="face" />

const DocumentFrontConfirm = appendToTracking(DocumentFrontWrapper, 'front')
const DocumentBackConfirm = appendToTracking(DocumentBackWrapper, 'back')
const DocumentVideoConfirm = appendToTracking(
  DocumentVideoWrapper,
  'document_video'
)
const SelfieConfirm = appendToTracking(BaseFaceConfirm, 'selfie')
const FaceVideoConfirm = appendToTracking(BaseFaceConfirm, 'face_video')

export {
  DocumentFrontConfirm,
  DocumentBackConfirm,
  DocumentVideoConfirm,
  SelfieConfirm,
  FaceVideoConfirm,
}
