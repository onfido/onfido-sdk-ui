import * as constants from '../../constants'
import objectAssign from 'object-assign'

const initialState = {
  document: [],
  face: []
}

const changeCapturesThatMatchValidator = (captures, validator, newCaptureDiffState) => captures.map( capture =>
  validator(capture) ? objectAssign({}, capture, newCaptureDiffState) : capture
)

export function captures(state = initialState, action) {
  const payload = action.payload || {}
  const captureType = payload.method
  const captures = state[captureType]

  const changeStateWithNewCaptures = newCaptureState => ({ ...state, [captureType]: newCaptureState })
  const changeCapturesThatMatchPayloadId = changeCapturesThatMatchValidator.bind(this,
                                              captures,
                                              capture => capture.id === payload.id)

  switch (action.type) {
    case constants.CAPTURE_CREATE:
      const { maxCaptures, capture } = payload
      const oldCaptures = captures.slice(0, maxCaptures -1 )
      return changeStateWithNewCaptures([capture, ...oldCaptures])
    case constants.CAPTURE_VALIDATE:
      const validatedCaptures = changeCapturesThatMatchPayloadId({ valid: payload.valid, processed: true })
      return changeStateWithNewCaptures(validatedCaptures)
    case constants.CAPTURE_CONFIRM:
      const confirmedCaptures = changeCapturesThatMatchPayloadId({ confirmed: true })
      return changeStateWithNewCaptures(confirmedCaptures)
    case constants.CAPTURE_DELETE:
      // Only delete the captures with the side specified in the payload.
      const differentSideCaptures = captures.filter(capture => capture.side !== payload.side)
      return changeStateWithNewCaptures(differentSideCaptures)
    default:
      return state
  }
}
