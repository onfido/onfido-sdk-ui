import * as constants from '../../constants'

export function faceCaptures(state = [], action) {
  switch (action.type) {
    case constants.FACE_CAPTURE:
      return [ action.payload, ...state ]
    default:
      return state
  }
}

export function documentCaptures(state = [], action) {
  switch (action.type) {
    case constants.DOCUMENT_CAPTURE:
      return [ action.payload, ...state ]
    default:
      return state
  }
}
