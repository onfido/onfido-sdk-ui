import * as constants from '../../constants'

const initialState = {
  documentType: null,
  roomId: null,
  socket: null,
  sms: {number: null, valid: false},
  clientSuccess: false,
  i18n: null,
  termsAccepted: false,
  permissionsAsked: false,
  hasCameraPermissions: false
}


export default function globals(state = initialState, action) {
  switch (action.type) {
    case constants.SET_DOCUMENT_TYPE:
      return {...state, documentType: action.payload }
    case constants.SET_ROOM_ID:
      return {...state, roomId: action.payload}
    case constants.SET_SOCKET:
      return {...state, socket: action.payload}
    case constants.SET_MOBILE_NUMBER:
      return {...state, sms: action.payload}
    case constants.SET_CLIENT_SUCCESS:
      return {...state, clientSuccess: action.payload}
    case constants.MOBILE_CONNECTED:
      return {...state, mobileConnected: action.payload}
    case constants.ACCEPT_TERMS:
      return {...state, termsAccepted: true}
    case constants.PERMISSIONS_ASKED:
      return {...state, permissionsAsked: action.payload}
    case constants.HAS_CAMERA_PERMISSIONS:
      return {...state, hasCameraPermissions: action.payload}
    default:
      return state
  }
}
