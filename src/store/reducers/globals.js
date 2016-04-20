const initialState = {
  jwt: null,
  authenticated: false,
  supportsWebSockets: false,
  hasDocumentCaptured: false,
  hasFaceCaptured: false
}

function data(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      state = Object.assign({}, state, {jwt: action.payload})
      return state
    case 'SET_AUTHENTICATED':
      state = Object.assign({}, state, {authenticated: action.payload})
      return state
    case 'SET_WEBSOCKET_SUPPORT':
      state = Object.assign({}, state, {supportsWebSockets: action.payload})
      return state
    case 'SET_DOCUMENT_CAPTURED':
      state = Object.assign({}, state, {hasDocumentCaptured: action.payload})
      return state
    case 'SET_FACE_CAPTURED':
      state = Object.assign({}, state, {hasFaceCaptured: action.payload})
      return state
    default:
      return state
  }
}

module.exports = data
