import { h } from 'preact'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'
import withPoAGuidanceScreen from '../ProofOfAddress/withGuidanceScreen'

const withOptions = (WrappedComponent, additionalProps = {}) =>
  optionsAsProps =>
    <WrappedComponent {...optionsAsProps} {...additionalProps} />

export default {
  FrontDocument: appendToTracking(withOptions(Document), 'front_capture'),
  BackDocument: appendToTracking(withOptions(Document, { side: 'back' }), 'back_capture'),
  Selfie: appendToTracking(withOptions(Face), 'selfie_capture'),
  Video: appendToTracking(withOptions(Face, { requestedVariant: 'video'}), 'video_capture'),
  PoADocument: appendToTracking(withPoAGuidanceScreen(Document), 'poa'),
}
