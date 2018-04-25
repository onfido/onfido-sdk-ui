import { h } from 'preact'
import Capture from './capture.js'
import { appendToTracking } from '../../Tracker'

const DocumentCapture = props => <Capture autoCapture={true} {...props} />

DocumentCapture.defaultProps = {
  useWebcam: false,
  method: 'document'
}

const FrontDocumentCapture = options => <DocumentCapture {...options} />
FrontDocumentCapture.defaultProps = { side: 'front' }

const BackDocumentCapture = options => <DocumentCapture {...options} />

BackDocumentCapture.defaultProps = { side: 'back' }

const FaceCapture = appendToTracking(options =>
  <Capture autoCapture={false} {...options} />, 'capture')

FaceCapture.defaultProps = {
  useWebcam: true,
  method: 'face',
  side: null
}

FaceCapture.isFullScreen = true

export default {
  FrontDocumentCapture: appendToTracking(FrontDocumentCapture, 'front_capture'),
  BackDocumentCapture: appendToTracking(BackDocumentCapture, 'back_capture'),
  FaceCapture
}
