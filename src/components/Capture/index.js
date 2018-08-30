import { h } from 'preact'
import Capture from './capture.js'
import { appendToTracking } from '../../Tracker'
import Face from './Face'
import Document from './Document'

const FrontDocument = optionsAsProps => <Document {...optionsAsProps} />

const BackDocument = optionsAsProps => <Document {...optionsAsProps} side="back" />

const Selfie = optionsAsProps => <Face {...optionsAsProps} />

const Liveness = optionsAsProps => <Face {...optionsAsProps} requestedVariant="video" />

export default {
  FrontDocumentCapture: appendToTracking(FrontDocument, 'front_capture'),
  BackDocumentCapture: appendToTracking(BackDocumentCapture, 'back_capture'),
  FaceCapture: appendToTracking(FaceCapture, 'capture'),
  LivenessCapture: appendToTracking(LivenessCapture, 'liveness_capture'),
}
