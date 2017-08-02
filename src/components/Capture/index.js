import { h, Component } from 'preact'
import Capture from './capture.js'
import { impurify } from '../utils'
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

const FaceCapture = options =>
  <Capture autoCapture={false} {...options} />

FaceCapture.defaultProps = {
  useWebcam: true,
  method: 'face',
  side: null
}

//TODO investigate this workaround of wrapping stateless components.
// It may be to do with preact vs react.
export default {
  FrontDocumentCapture: appendToTracking(impurify(FrontDocumentCapture), 'front_capture'),
  BackDocumentCapture: appendToTracking(impurify(BackDocumentCapture), 'back_capture'),
  FaceCapture: appendToTracking(impurify(FaceCapture), 'capture')
}
