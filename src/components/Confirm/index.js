import { h } from 'preact'
import { connect } from 'react-redux'
import { cleanFalsy } from '~utils/array'
import Confirm from './Confirm'
import { trackComponentAndMode, appendToTracking } from '../../Tracker'
import { localised } from '../../locales'

const captureKey = (...args) => cleanFalsy(args).join('_')

const mapStateToProps = (state, { method, side }) => ({
  capture: state.captures[captureKey(method, side)],
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
const VideoConfirm = appendToTracking(BaseFaceConfirm, 'video')

export {
  DocumentFrontConfirm,
  DocumentBackConfirm,
  SelfieConfirm,
  VideoConfirm,
}
