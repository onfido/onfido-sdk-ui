const initialState = {
  jwt: null,
  supportsWebSockets: false
}

function data(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      state.jwt = action.jwt
      return state
    case 'SET_WEBSOCKET_SUPPORT':
      state.supportsWebSockets = action.supportsWebSockets
      return state
    default:
      return state
  }
}

module.exports = data
