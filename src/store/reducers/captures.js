import * as constants from '../../constants'
import objectAssign from 'object-assign'

const initialState = {
  document: [],
  face: []
}

const changeCapturesState = (captures, validator, newCaptureDiffState) => captures.map( capture =>
  validator(capture) ? objectAssign({}, capture, newCaptureDiffState) : capture
)

export function captures(state = initialState, action) {
  const payload = action.payload || {}
  const captureType = payload.method? payload.method : payload
  const captures = state[captureType]

  const newStateWithCaptureState = newCaptureState => objectAssign({}, state, { [captureType]: newCaptureState })
  const changeCapturesStateBinded = changeCapturesState.bind(this, captures)

  switch (action.type) {
    case constants.CAPTURE_CREATE:
      const oldCaptures = captures.slice(0, 2)
      return newStateWithCaptureState([payload.data, ...oldCaptures])
    case constants.CAPTURE_VALID:
      const valid = changeCapturesStateBinded(capture => capture.id === payload.data, { valid: true })
      return newStateWithCaptureState(valid)
    case constants.CAPTURE_CONFIRM:
      const confirmed = changeCapturesStateBinded(capture => capture.id === payload.data.id, { confirmed: true })
      return newStateWithCaptureState(confirmed)
    case constants.CAPTURE_DELETE:
      return newStateWithCaptureState([])
    default:
      return initialState
  }
}
