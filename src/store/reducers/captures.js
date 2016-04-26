function faceCaptures(state = [], action) {
  switch (action.type) {
    case 'FACE_CAPTURE':
      return [action.payload, ...state]
    default:
      return state
  }
}

function documentCaptures(state = [], action) {
  switch (action.type) {
    case 'DOCUMENT_CAPTURE':
      return [action.payload, ...state]
    default:
      return state
  }
}

module.exports = {
  faceCaptures,
  documentCaptures
}
