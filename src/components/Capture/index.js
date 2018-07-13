import { h } from 'preact'
import Capture from './capture.js'
import { appendToTracking } from '../../Tracker'

const webcamSupportChangeHandler = ({ changeFlowTo, useWebcam }) =>
  useWebcam ? {
    onWebcamSupportChange: hasWebcam => !hasWebcam && changeFlowTo('crossDeviceSteps', 0, false),
  } : {}

const DocumentCapture = props => <Capture autoCapture={true} {...props} {...webcamSupportChangeHandler(props)}/>

DocumentCapture.defaultProps = {
  useWebcam: false,
  method: 'document',
}

const FrontDocumentCapture = options => <DocumentCapture {...options} />
FrontDocumentCapture.defaultProps = { side: 'front' }

const BackDocumentCapture = options => <DocumentCapture {...options} />

BackDocumentCapture.defaultProps = { side: 'back' }

const FaceCapture = props =>
  <Capture autoCapture={false} {...props} {...webcamSupportChangeHandler(props)} />

FaceCapture.defaultProps = {
  useWebcam: true,
  method: 'face',
  side: null
}

export default {
  FrontDocumentCapture: appendToTracking(FrontDocumentCapture, 'front_capture'),
  BackDocumentCapture: appendToTracking(BackDocumentCapture, 'back_capture'),
  FaceCapture: appendToTracking(FaceCapture, 'capture')
}
