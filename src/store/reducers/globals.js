import objectAssign from 'object-assign';
import * as constants from '../../constants';

const initialState = {
  jwt: null,
  authenticated: false,
  supportsWebSockets: false,
  supportsGetUserMedia: false,
  hasDocumentCaptured: false,
  hasFaceCaptured: false
};

export default function globals(state = initialState, action) {
  switch (action.type) {
    case constants.SET_TOKEN:
      state = objectAssign({}, state, {jwt: action.payload})
      return state
    case constants.SET_AUTHENTICATED:
      state = objectAssign({}, state, {authenticated: action.payload})
      return state
    case constants.SET_WEBSOCKET_SUPPORT:
      state = objectAssign({}, state, {supportsWebSockets: action.payload})
      return state
    case constants.SET_GUM_SUPPORT:
      state = objectAssign({}, state, {supportsGetUserMedia: action.payload})
      return state
    case constants.SET_DOCUMENT_CAPTURED:
      state = objectAssign({}, state, {hasDocumentCaptured: action.payload})
      return state
    case constants.SET_FACE_CAPTURED:
      state = objectAssign({}, state, {hasFaceCaptured: action.payload})
      return state
    default:
      return state
  }
}
