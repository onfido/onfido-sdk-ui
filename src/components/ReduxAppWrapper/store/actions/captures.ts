import * as constants from '~types/redux/constants'
import { pick, omitBy } from '~utils/object'

import type {
  CaptureActions,
  DocumentCapture,
  FaceCapture,
  CapturePayload,
  MetadataPayload,
} from '~types/redux'

export const createCapture = (
  payload: DocumentCapture | FaceCapture
): CaptureActions => ({
  type: constants.CAPTURE_CREATE,
  payload,
})

export const deleteCapture = (payload: CapturePayload): CaptureActions => ({
  type: constants.CAPTURE_DELETE,
  payload,
})

export const setCaptureMetadata = ({
  capture,
  apiResponse,
}: {
  capture: DocumentCapture | FaceCapture
  apiResponse: Record<string, unknown>
}): CaptureActions => {
  const payload: MetadataPayload = {
    captureId: capture.id,
    metadata: omitBy(
      {
        ...pick(apiResponse, ['id', 'side', 'type']),
        // we only want the face variant to show in the metadata
        variant: capture.method === 'face' && (capture as FaceCapture).variant,
      },
      // omit any null/undefined metadata values
      (_key: unknown, value: unknown) => !value
    ),
  }

  return { type: constants.SET_CAPTURE_METADATA, payload }
}
