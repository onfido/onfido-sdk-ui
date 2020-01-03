import { pick, omitBy } from '~utils/object'
import { CAPTURE_CREATE, CAPTURE_DELETE, SET_CAPTURE_METADATA } from '../../constants'

export const createCapture = payload => ({ type: CAPTURE_CREATE, payload })
export const deleteCapture = () => ({ type: CAPTURE_DELETE })

export const setCaptureMetadata = ({ capture, apiResponse }) => {
  const payload = {
    captureId: capture.id,
    metadata: omitBy(
      {
        ...pick(apiResponse, ["id", "side", "type"]),
        // we only want the face variant to show in the metadata
        variant: capture.method === "face" && capture.variant
      },
      // omit any null/undefined metadata values
      (key, value) => !value
    )
  }

  return { type: SET_CAPTURE_METADATA, payload }
}
