import * as constants from '~types/redux/constants'
import type { GlobalActions, GlobalState } from '~types/redux'

export const initialState: GlobalState = {
  documentType: null,
  idDocumentIssuingCountry: null,
  poaDocumentType: null,
  roomId: null,
  socket: null,
  sms: { number: null, valid: false },
  clientSuccess: false,
  mobileConnected: false,
  termsAccepted: false,
  isNavigationDisabled: false,
  isFullScreen: false,
  deviceHasCameraSupport: false,
  // This prevents logo from being shown before state can be updated to hide it.
  hideOnfidoLogo: true,
  cobrand: null,
  urls: {
    onfido_api_url: `${process.env.ONFIDO_API_URL}`,
    telephony_url: `${process.env.SMS_DELIVERY_URL}`,
    hosted_sdk_url: `${process.env.MOBILE_URL}`,
    detect_document_url: `${process.env.ONFIDO_SDK_URL}`,
    sync_url: `${process.env.DESKTOP_SYNC_URL}`,
  },
  /**
   * Number of retries on image quality reasons: cut-off, glare, blur
   * If the API returns warning on one of those reasons, increase this state by 1 and ask for redo
   * After at most <MAX_RETRIES_FOR_IMAGE_QUALITY> retries and there's still warning, allow user to proceed.
   */
  imageQualityRetries: 0,
}

export default function globals(
  state = initialState,
  action: GlobalActions
): GlobalState {
  switch (action.type) {
    case constants.SET_ID_DOCUMENT_TYPE:
      return {
        ...state,
        documentType: action.payload,
        poaDocumentType: null,
      }

    case constants.SET_ID_ISSUING_COUNTRY:
      return {
        ...state,
        idDocumentIssuingCountry: action.payload,
      }

    case constants.RESET_ID_ISSUING_COUNTRY:
      return {
        ...state,
        idDocumentIssuingCountry: initialState.idDocumentIssuingCountry,
      }

    case constants.SET_POA_DOCUMENT_TYPE:
      return {
        ...state,
        poaDocumentType: action.payload,
      }

    case constants.SET_ROOM_ID:
      return { ...state, roomId: action.payload }

    case constants.SET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      }

    case constants.SET_MOBILE_NUMBER:
      return { ...state, sms: action.payload }

    case constants.SET_CLIENT_SUCCESS:
      return {
        ...state,
        clientSuccess: action.payload,
      }

    case constants.MOBILE_CONNECTED:
      return {
        ...state,
        mobileConnected: action.payload,
      }

    case constants.ACCEPT_TERMS:
      return { ...state, termsAccepted: true }

    case constants.SET_NAVIGATION_DISABLED:
      return {
        ...state,
        isNavigationDisabled: action.payload,
      }

    case constants.SET_FULL_SCREEN:
      return { ...state, isFullScreen: action.payload }

    case constants.SET_DEVICE_HAS_CAMERA_SUPPORT:
      return {
        ...state,
        deviceHasCameraSupport: action.payload,
      }

    case constants.SET_URLS:
      return {
        ...state,
        urls: {
          ...state.urls,
          ...action.payload,
        },
      }

    case constants.HIDE_ONFIDO_LOGO:
      return {
        ...state,
        hideOnfidoLogo: action.payload,
      }

    case constants.SHOW_COBRANDING:
      return {
        ...state,
        cobrand: action.payload,
      }

    case constants.RETRY_FOR_IMAGE_QUALITY:
      return {
        ...state,
        imageQualityRetries: state.imageQualityRetries + 1,
      }

    case constants.RESET_IMAGE_QUALITY_RETRIES:
      return {
        ...state,
        imageQualityRetries: 0,
      }

    case constants.RESET_STORE:
      return initialState

    default:
      return state
  }
}
