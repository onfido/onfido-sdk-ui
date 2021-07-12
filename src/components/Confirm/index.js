import { h } from 'preact'
import { connect } from 'react-redux'

import { buildCaptureStateKey } from '~utils/redux'
import { trackComponentAndMode, appendToTracking } from '../../Tracker'
import { localised } from '../../locales'
import Confirm from './Confirm'

const mapStateToProps = (state, { method, side }) => ({
  capture: state.captures[buildCaptureStateKey({ method, side })],
  documentVideoCapture: state.captures.document_video,
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

const BaseFaceConfirm = (props) => <MapConfirm {...props} method="face" />

const DocumentFrontConfirm = appendToTracking(DocumentFrontWrapper, 'front')
const DocumentBackConfirm = appendToTracking(DocumentBackWrapper, 'back')
const SelfieConfirm = appendToTracking(BaseFaceConfirm, 'selfie')
const FaceVideoConfirm = appendToTracking(BaseFaceConfirm, 'face_video')

export {
  DocumentFrontConfirm,
  DocumentBackConfirm,
  SelfieConfirm,
  FaceVideoConfirm,
}
