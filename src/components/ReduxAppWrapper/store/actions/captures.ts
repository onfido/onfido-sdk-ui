import { pick, omitBy } from '~utils/object'
import * as constants from '../../constants'
import { ActionType, ActionCreatorType } from '../../types'

export const createCapture: ActionCreatorType<unknown> = (payload) => ({
  type: constants.CAPTURE_CREATE,
  payload,
})

export const deleteCapture = (): ActionType<unknown> => ({
  type: constants.CAPTURE_DELETE,
})

export const setCaptureMetadata = ({
  capture: unknown,
  apiResponse: unknown,
}): ActionType<unknown> => {
  const payload = {
    captureId: capture.id,
    metadata: omitBy(
      {
        ...pick(apiResponse, ['id', 'side', 'type']),
        // we only want the face variant to show in the metadata
        variant: capture.method === 'face' && capture.variant,
      },
      // omit any null/undefined metadata values
      (key, value) => !value
    ),
  }

  return { type: constants.SET_CAPTURE_METADATA, payload }
}
