function documents(state = [], action) {
  switch (action.type) {
    case 'ADD_DOCUMENT':
      return [action.data, ...state]
    default:
      return state
  }
}

module.exports = documents
