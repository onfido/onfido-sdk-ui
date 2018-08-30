import { h } from 'preact'
import Capture from './capture.js'
import { appendToTracking } from '../../Tracker'
import Face from './Face'
import Document from './Document'

const withOptionsAsProps = (WrappedComponent, additionalProps = {}) =>
  optionsAsProps =>
    <WrappedComponent {...optionsAsProps} {...additionalProps} />

export default {
  FrontDocument: appendToTracking(withOptionsAsProps(Document), 'front_capture'),
  BackDocument: appendToTracking(withOptionsAsProps(Document, { side: 'back' }), 'back_capture'),
  Selfie: appendToTracking(withOptionsAsProps(Face), 'capture'),
  Liveness: appendToTracking(withOptionsAsProps(Face, { requestedVariant: 'video'}), 'liveness_capture'),
}
