import { ComponentType } from 'preact'
import { StepComponentProps } from '~types/routers'
import { appendToTracking } from '../../Tracker'
import Document from './Document'
import Face from './Face'
import ProfileData from './ProfileData'
import ProofOfAddress from './ProofOfAddress'
import withCaptureVariant from './withCaptureVariant'

export const DocumentFrontCapture = appendToTracking(
  withCaptureVariant(Document, { side: 'front', requestedVariant: 'standard' }),
  'front_capture'
) as ComponentType<StepComponentProps>

export const DocumentBackCapture = appendToTracking(
  withCaptureVariant(Document, { side: 'back', requestedVariant: 'standard' }),
  'back_capture'
) as ComponentType<StepComponentProps>

export const DocumentVideoCapture = appendToTracking(
  withCaptureVariant(Document, { side: 'front', requestedVariant: 'video' }),
  'document_video_capture'
) as ComponentType<StepComponentProps>

export const PoACapture = appendToTracking(
  withCaptureVariant(ProofOfAddress, {
    forceCrossDevice: false,
  }),
  'poa'
) as ComponentType<StepComponentProps>

export const SelfieCapture = appendToTracking(
  withCaptureVariant(Face, {
    requestedVariant: 'standard',
    pageId: 'SelfieCapture',
  }),
  'selfie_capture'
) as ComponentType<StepComponentProps>

export const FaceVideoCapture = appendToTracking(
  withCaptureVariant(Face, {
    requestedVariant: 'video',
    pageId: 'FaceVideoCapture',
  }),
  'face_video_capture'
) as ComponentType<StepComponentProps>

export const DataCapture = appendToTracking(ProfileData, 'data_capture')
