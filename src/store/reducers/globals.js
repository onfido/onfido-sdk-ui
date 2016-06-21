import objectAssign from 'object-assign'
import * as constants from '../../constants'

const initialState = {
  authenticated: false,
  supportsWebSockets: false,
  supportsGetUserMedia: false,
  websocketErrorEncountered: null,
  documentType: null
}

export default function globals(state = initialState, action) {
  switch (action.type) {
    case constants.SET_AUTHENTICATED:
      state = objectAssign({}, state, { authenticated: action.payload })
      return state
    case constants.SET_WEBSOCKET_SUPPORT:
      state = objectAssign({}, state, { supportsWebSockets: action.payload })
      return state
    case constants.SET_WEBSOCKET_ERROR:
      state = objectAssign({}, state, { websocketErrorEncountered: action.payload })
      return state
    case constants.SET_GUM_SUPPORT:
      state = objectAssign({}, state, { supportsGetUserMedia: action.payload })
      return state
    case constants.SET_DOCUMENT_TYPE:
      state = objectAssign({}, state, { documentType: action.payload })
      return state
    default:
      return state
  }
}
