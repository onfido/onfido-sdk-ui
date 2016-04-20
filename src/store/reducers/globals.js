const initialState = {
  jwt: null,
  supportsWebSockets: false,
  hasDocumentCaptured: false,
  hasFaceCaptured: false
}

function data(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      state.jwt = action.payload
      return {state}
    case 'SET_WEBSOCKET_SUPPORT':
      state.supportsWebSockets = action.payload
      return state
    case 'SET_DOCUMENT_CAPTURED':
      state.hasDocumentCaptured = action.payload
      return state
    case 'SET_FACE_CAPTURED':
      state.hasFaceCaptured = action.payload
      return state
    default:
      return state
  }
}

module.exports = data
