import type { SdkMetadata } from '~types/commons'
import type { DocumentTypes, RequestedVariant } from '~types/steps'
import type {
  CapturePayload,
  MetadataState,
  DocumentCapture,
  FaceCapture,
} from '~types/redux'

export const fakeCapturePayload = (
  variant: RequestedVariant
): CapturePayload => {
  const fakeSdkMetadata: SdkMetadata = {
    captureMethod: 'live',
    camera_name: 'fake-video-track',
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
  variant: RequestedVariant
): DocumentCapture & MetadataState => ({
  ...fakeCapturePayload(variant),
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
