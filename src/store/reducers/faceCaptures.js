function faceCaptures(state = [], action) {
  switch (action.type) {
    case 'FACE_CAPTURE':
      return [action.data, ...state]
    default:
      return state
  }
}

module.exports = faceCaptures
