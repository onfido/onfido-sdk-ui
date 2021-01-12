import * as constants from '../constants'
import type { EnterpriseCobranding } from '~types/enterprise'

export type CountryPayload = {
  country_alpha2?: string
  country_alpha3?: string
  name?: string
}

export type SmsPayload = {
  number?: string
  valid?: boolean
}

export type UrlsPayload = {
  onfido_api_url?: string
  telephony_url?: string
  hosted_sdk_url?: string
  detect_document_url?: string
  sync_url?: string
}

export type GlobalActions =
  | { type: typeof constants.SET_ID_DOCUMENT_TYPE; payload: string }
  | { type: typeof constants.SET_ID_ISSUING_COUNTRY; payload: CountryPayload }
  | { type: typeof constants.RESET_ID_ISSUING_COUNTRY }
  | { type: typeof constants.SET_POA_DOCUMENT_TYPE; payload: string }
  | { type: typeof constants.SET_ROOM_ID; payload: string }
  | { type: typeof constants.SET_SOCKET; payload: SocketIOClient.Socket }
  | { type: typeof constants.SET_MOBILE_NUMBER; payload: SmsPayload }
  | { type: typeof constants.SET_CLIENT_SUCCESS; payload: boolean }
  | { type: typeof constants.MOBILE_CONNECTED; payload: boolean }
  | { type: typeof constants.ACCEPT_TERMS }
  | { type: typeof constants.SET_NAVIGATION_DISABLED; payload: boolean }
  | { type: typeof constants.SET_FULL_SCREEN; payload: boolean }
  | { type: typeof constants.SET_DEVICE_HAS_CAMERA_SUPPORT; payload: boolean }
  | { type: typeof constants.SET_URLS; payload: UrlsPayload }
  | { type: typeof constants.HIDE_ONFIDO_LOGO; payload: boolean }
  | { type: typeof constants.SHOW_COBRANDING; payload: EnterpriseCobranding }
  | { type: typeof constants.RETRY_FOR_IMAGE_QUALITY }
  | { type: typeof constants.RESET_IMAGE_QUALITY_RETRIES }
  | { type: typeof constants.RESET_STORE }

export type GlobalState = {
  documentType?: string
  idDocumentIssuingCountry: CountryPayload
  poaDocumentType?: string
  roomId?: string
  socket?: SocketIOClient.Socket
  sms: SmsPayload
  clientSuccess?: boolean
  mobileConnected?: boolean
  termsAccepted?: boolean
  isNavigationDisabled?: boolean
  isFullScreen?: boolean
  deviceHasCameraSupport?: boolean
  // This prevents logo from being shown before state can be updated to hide it.
  hideOnfidoLogo?: boolean
  cobrand?: EnterpriseCobranding
  urls: UrlsPayload
  /**
   * Number of retries on image quality reasons: cut-off, glare, blur
   * If the API returns warning on one of those reasons, increase this state by 1 and ask for redo
   * After at most <MAX_RETRIES_FOR_IMAGE_QUALITY> retries and there's still warning, allow user to proceed.
   */
  imageQualityRetries: number
}
