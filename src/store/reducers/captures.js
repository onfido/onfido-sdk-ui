export function faceCaptures(state = [], action) {
  switch (action.type) {
    case 'FACE_CAPTURE':
      return [action.payload, ...state]
    default:
      return state
  }
}

export function documentCaptures(state = [], action) {
  switch (action.type) {
    case 'DOCUMENT_CAPTURE':
      return [action.payload, ...state]
    default:
      return state
  }
}
