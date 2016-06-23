import * as constants from '../../constants'
import objectAssign from 'object-assign'

const initialState = {
  document: [],
  face: []
}

export function captures(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case constants.CAPTURE_CREATE:
      const captures = state[payload.method].slice(0, 2)
      const newState = { [payload.method]: [ payload.data, ...captures ] }
      return objectAssign({}, state, newState)
    case constants.CAPTURE_VALID:
      const valid = state[payload.method].map(capture =>
        capture.id === payload.data
          ? objectAssign({}, capture, { valid: true })
          : capture
      )
      return objectAssign({}, state, { [payload.method]: valid })
    case constants.CAPTURE_DELETE:
      const emptyState = { [payload]: [] }
      return objectAssign({}, state, emptyState)
    default:
      return initialState
  }
}
