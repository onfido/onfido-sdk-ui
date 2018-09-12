import { h } from 'preact'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'
import withPoAGuidanceScreen from '../ProofOfAddress/withGuidanceScreen'

const withOptions = (WrappedComponent, additionalProps = {}) =>
  optionsAsProps =>
    <WrappedComponent {...optionsAsProps} {...additionalProps} />

export default {
  FrontDocumentCapture: appendToTracking(withOptions(Document), 'front_capture'),
  BackDocumentCapture: appendToTracking(withOptions(Document, { side: 'back' }), 'back_capture'),
  SelfieCapture: appendToTracking(withOptions(Face), 'selfie_capture'),
  VideoCapture: appendToTracking(withOptions(Face, { requestedVariant: 'video'}), 'video_capture'),
  PoADocumentCapture: appendToTracking(withPoAGuidanceScreen(Document), 'poa'),
}
