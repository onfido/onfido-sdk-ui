import * as constants from '../../constants'

export function documentCaptures(state = [], action) {
  switch (action.type) {
    case constants.DOCUMENT_CAPTURE:
      const arr = state.slice(0, 2)
      return [ action.payload, ...arr ]
    default:
      return state
  }
}

export function faceCaptures(state = [], action) {
  switch (action.type) {
    case constants.FACE_CAPTURE:
      const arr = state.slice(0, 2)
      return [ action.payload, ...arr ]
    default:
      return state
  }
}
