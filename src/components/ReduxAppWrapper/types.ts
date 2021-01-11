import * as constants from './constants'
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
  onfido_api_url: string
  telephony_url: string
  hosted_sdk_url: string
  detect_document_url: string
  sync_url: string
}

export type ActionType<T> = {
  type: string
  payload?: T
}

export type ActionCreatorType<T> = (payload: T) => ActionType<T>

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
