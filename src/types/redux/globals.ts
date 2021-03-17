import * as constants from './constants'
import type { CountryData, UrlsConfig } from '~types/commons'
import type {
  EnterpriseCobranding,
  EnterpriseLogoCobranding,
} from '~types/enterprise'
import type { DocumentTypes, PoaTypes } from '~types/steps'

export type SmsPayload = {
  number?: string
  valid?: boolean
}

export type GlobalActions =
  | { type: typeof constants.SET_ID_DOCUMENT_TYPE; payload: DocumentTypes }
  | { type: typeof constants.SET_ID_ISSUING_COUNTRY; payload: CountryData }
  | { type: typeof constants.RESET_ID_ISSUING_COUNTRY }
  | { type: typeof constants.SET_POA_DOCUMENT_TYPE; payload: PoaTypes }
  | { type: typeof constants.SET_ROOM_ID; payload: string }
  | { type: typeof constants.SET_SOCKET; payload: SocketIOClient.Socket }
  | { type: typeof constants.SET_MOBILE_NUMBER; payload: SmsPayload }
  | { type: typeof constants.SET_CLIENT_SUCCESS; payload: boolean }
  | { type: typeof constants.MOBILE_CONNECTED; payload: boolean }
  | { type: typeof constants.ACCEPT_TERMS }
  | { type: typeof constants.SET_NAVIGATION_DISABLED; payload: boolean }
  | { type: typeof constants.SET_FULL_SCREEN; payload: boolean }
  | { type: typeof constants.SET_DEVICE_HAS_CAMERA_SUPPORT; payload: boolean }
  | { type: typeof constants.SET_URLS; payload: UrlsConfig }
  | { type: typeof constants.HIDE_ONFIDO_LOGO; payload: boolean }
  | { type: typeof constants.SHOW_COBRANDING; payload: EnterpriseCobranding }
  | {
      type: typeof constants.SHOW_LOGO_COBRANDING
      payload: EnterpriseLogoCobranding
    }
  | { type: typeof constants.SET_DECOUPLE_FROM_API; payload: boolean }
  | { type: typeof constants.RETRY_FOR_IMAGE_QUALITY }
  | { type: typeof constants.RESET_IMAGE_QUALITY_RETRIES }
  | { type: typeof constants.RESET_STORE }

export type GlobalState = {
  documentType?: DocumentTypes
  idDocumentIssuingCountry?: CountryData
  poaDocumentType?: PoaTypes
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
  logoCobrand?: EnterpriseLogoCobranding
  isDecoupledFromAPI?: boolean
  urls: UrlsConfig
  /**
   * Number of retries on image quality reasons: cut-off, glare, blur
   * If the API returns an error on one of those reasons, increase this state by 1 and ask for redo
   * After at most <MAX_IMAGE_QUALITY_RETRIES_WITH_ERROR> retries, the user will be allowed to proceed, as any image quality related validation from this point on will be treated as a warning.
   */
  imageQualityRetries: number
}
