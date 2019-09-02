import { h } from 'preact'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'

const withOptions = (WrappedComponent, additionalProps = {}) =>
  optionsAsProps =>
    <WrappedComponent {...optionsAsProps} {...additionalProps} />

export const FrontDocumentCapture = appendToTracking(withOptions(Document), 'front_capture')
export const BackDocumentCapture = appendToTracking(withOptions(Document, { side: 'back' }), 'back_capture')
export const SelfieCapture = appendToTracking(withOptions(Face, { requestedVariant: 'standard' }), 'selfie_capture')
export const VideoCapture = appendToTracking(withOptions(Face, { requestedVariant: 'video' }), 'video_capture')
export const PoADocumentCapture = appendToTracking(withOptions(Document, { isPoA: true, forceCrossDevice: false }), 'poa')
