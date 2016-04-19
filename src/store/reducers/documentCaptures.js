function documentCaptures(state = [], action) {
  switch (action.type) {
    case 'DOCUMENT_CAPTURE':
      return [action.data, ...state]
    default:
      return state
  }
}

module.exports = documentCaptures
