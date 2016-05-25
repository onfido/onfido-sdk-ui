import * as constants from '../../constants'
import objectAssign from 'object-assign'

export function documentCaptures(state = [], action) {
  switch (action.type) {
    case constants.DOCUMENT_CAPTURE:
      const arr = state.slice(0, 4)
      return [ action.payload, ...arr ]
    case constants.CAPTURE_IS_VALID:
      return state.map(capture => {
        return capture.id === action.payload
          ? objectAssign({}, capture, { isValid: true })
          : capture
      })
    default:
      return state
  }
}

export function faceCaptures(state = [], action) {
  switch (action.type) {
    case constants.FACE_CAPTURE:
      const arr = state.slice(0, 4)
      return [ action.payload, ...arr ]
    default:
      return state
  }
}
