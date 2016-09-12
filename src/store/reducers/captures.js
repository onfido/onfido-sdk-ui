import * as constants from '../../constants'
import objectAssign from 'object-assign'

const initialState = {
  document: [],
  face: []
}

const changeCaptures = (captures, validator, newCaptureDiffState) => captures.map( capture =>
  validator(capture) ? objectAssign({}, capture, newCaptureDiffState) : capture
)

export function captures(state = initialState, action) {
  const { payload } = action
  const captureType = payload.method
  const captures = state[captureType]
  const newStateWithCaptureState = newCaptureState => objectAssign({}, state, { [captureType]: newCaptureState })

  switch (action.type) {
    case constants.CAPTURE_CREATE:
      const oldCaptures = captures.slice(0, 2)
      return newStateWithCaptureState([ payload.data, ...oldCaptures ])
    case constants.CAPTURE_VALID:
      const valid = changeCaptures(captures, capture => capture.id === payload.data, { valid: true })
      return newStateWithCaptureState(valid)
    case constants.CAPTURE_CONFIRM:
      const confirmed = changeCaptures(captures, capture => capture.id === payload.id, { confirmed: true })
      return newStateWithCaptureState(confirmed)
    case constants.CAPTURE_DELETE:
      return newStateWithCaptureState([])
    default:
      return initialState
  }
}
