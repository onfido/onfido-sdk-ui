import { h } from 'preact'
import { appendToTracking } from '../../Tracker'
import DocumentCaptureFlow from './DocumentCaptureFlow'
import Face from './Face'

const withOptions = (WrappedComponent, additionalProps = {}) =>
  optionsAsProps =>
    <WrappedComponent {...optionsAsProps} {...additionalProps} />

export const DocumentCapture = withOptions(DocumentCaptureFlow)
export const PoADocumentCapture = appendToTracking(withOptions(DocumentCaptureFlow, { forceCrossDevice: false }), 'poa')
export const SelfieCapture = appendToTracking(withOptions(Face, { requestedVariant: 'standard' }), 'selfie_capture')
export const VideoCapture = appendToTracking(withOptions(Face, { requestedVariant: 'video' }), 'video_capture')
