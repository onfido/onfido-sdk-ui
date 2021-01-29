import type { DocumentSides, SdkMetadata } from '~types/commons'
import type { DocumentTypes, RequestedVariant } from '~types/steps'
import type {
  CapturePayload,
  DocumentCapture,
  FaceCapture,
  MetadataState,
} from '~types/redux'

export const fakeCapturePayload = (
  variant: RequestedVariant,
  side?: DocumentSides
): CapturePayload => {
  const suffix = side ? `-${side}` : ''
  const fakeSdkMetadata: SdkMetadata = {
    captureMethod: 'live',
    camera_name: `fake-video-track${suffix}`,
    microphone_name: 'fake-audio-track',
  }

  return {
    blob: new Blob([], {
      type: variant === 'video' ? 'video/webm' : 'image/jpeg',
    }),
    sdkMetadata: fakeSdkMetadata,
  }
}

export const fakeDocumentCaptureState = (
  documentType: DocumentTypes,
  variant: RequestedVariant,
  side?: DocumentSides
): DocumentCapture & MetadataState => ({
  ...fakeCapturePayload(variant, side),
  documentType,
  id: `fake-${documentType}-id`,
  metadata: {},
})

export const fakeFaceCaptureState = (
  variant: RequestedVariant
): FaceCapture & MetadataState => ({
  ...fakeCapturePayload(variant),
  id: 'fake-capture-id',
  metadata: {},
})
