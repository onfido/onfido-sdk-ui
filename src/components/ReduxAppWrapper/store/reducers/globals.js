import * as constants from '../../constants'

const initialState = {
  documentType: null,
  poaDocumentType: null,
  roomId: null,
  socket: null,
  sms: {number: null, valid: false},
  clientSuccess: false,
  termsAccepted: false,
  isNavigationDisabled: false,
  isFullScreen: false,
  deviceHasCameraSupport: false,
  hideOnfidoLogo: true,
  urls: {
    onfido_api_url: `${process.env.ONFIDO_API_URL}`,
    telephony_url: `${process.env.SMS_DELIVERY_URL}`,
    hosted_sdk_url: `${process.env.MOBILE_URL}`,
    detect_document_url: `${process.env.ONFIDO_SDK_URL}`,
    sync_url: `${process.env.DESKTOP_SYNC_URL}`
  }
}


export default function globals(state = initialState, action) {
  switch (action.type) {
    case constants.SET_ID_DOCUMENT_TYPE:
      return {
        ...state,
        documentType: action.payload,
        poaDocumentType: null
      }
    case constants.SET_POA_DOCUMENT_TYPE:
      return {...state, poaDocumentType: action.payload }
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
    case constants.SET_NAVIGATION_DISABLED:
      return {...state, isNavigationDisabled: !!action.payload}
    case constants.SET_FULL_SCREEN:
      return {...state, isFullScreen: !!action.payload}
    case constants.SET_DEVICE_HAS_CAMERA_SUPPORT:
      return {...state, deviceHasCameraSupport: !!action.payload}
    case constants.SET_URLS:
      return {
        ...state,
        urls: {
          ...state.urls,
          ...action.payload
        }
      }
    case constants.SET_ONFIDO_LOGO_DISABELD:
      return {...state, hideOnfidoLogo: action.payload}
    default:
      return state
  }
}
