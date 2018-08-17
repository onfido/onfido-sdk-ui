import { h } from 'preact'
import Capture from './capture.js'
import { appendToTracking } from '../../Tracker'

const webcamSupportChangeHandler = ({ changeFlowTo, useWebcam, allowCrossDeviceFlow }) =>
  useWebcam ? {
    onWebcamSupportChange: hasWebcam => {
      if (!hasWebcam && allowCrossDeviceFlow) {
        changeFlowTo('crossDeviceSteps', 0, true)
      }
    }
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
  desiredVariant: 'standard',
  side: null
}

const LivenessCapture = props =>
  <FaceCapture {...props} liveness />

export default {
  FrontDocumentCapture: appendToTracking(FrontDocumentCapture, 'front_capture'),
  BackDocumentCapture: appendToTracking(BackDocumentCapture, 'back_capture'),
  FaceCapture: appendToTracking(FaceCapture, 'capture'),
  LivenessCapture: appendToTracking(LivenessCapture, 'liveness_capture'),
}
