import { pick, omitBy } from '~utils/object'
import * as constants from '../../constants'
import type {
  ActionType,
  ActionCreatorType,
  DocumentCapture,
  FaceCapture,
  CapturePayload,
  MetadataPayload,
} from '../../types'

export const createCapture: ActionCreatorType<CapturePayload> = (payload) => ({
  type: constants.CAPTURE_CREATE,
  payload,
})

export const deleteCapture = (): ActionType<never> => ({
  type: constants.CAPTURE_DELETE,
})

export const setCaptureMetadata = ({
  capture,
  apiResponse,
}: {
  capture: DocumentCapture | FaceCapture
  apiResponse: unknown
}): ActionType<MetadataPayload> => {
  const payload = {
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
