import * as constants from '../../constants'
import objectAssign from 'object-assign'

const initialState = {
  document: [],
  face: []
}

export function captures(state = initialState, action) {
  const { payload } = action
  const captureType = payload.method
  const newStateWithCaptureState = ( newCaptureState) => objectAssign({}, state, { [captureType]: newCaptureState })

  switch (action.type) {
    case constants.CAPTURE_CREATE:
      const captures = state[captureType].slice(0, 2)
      return newStateWithCaptureState([ payload.data, ...captures ])
    case constants.CAPTURE_VALID:
      const valid = state[captureType].map(capture =>
        capture.id === payload.data
          ? objectAssign({}, capture, { valid: true })
          : capture
      )
      return newStateWithCaptureState(valid)
    case constants.CAPTURE_DELETE:
      return newStateWithCaptureState([])
    default:
      return initialState
  }
}
