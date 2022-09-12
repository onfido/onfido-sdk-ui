import * as constants from './constants'
import type { CountryData, UrlsConfig, ExtendedStepTypes } from '~types/commons'
import type {
  EnterpriseCobranding,
  EnterpriseLogoCobranding,
} from '~types/enterprise'
import type { DocumentTypes, PoaTypes, StepConfig } from '~types/steps'
import type { Socket } from 'socket.io-client'
import { SdkConfiguration } from '~core/SdkConfiguration/types'

export type SmsPayload = {
  number?: string
  valid?: boolean
}

export type GlobalActions =
  | { type: typeof constants.SET_CURRENT_STEP_TYPE; payload: ExtendedStepTypes }
  | { type: typeof constants.SET_ID_DOCUMENT_TYPE; payload: DocumentTypes }
  | { type: typeof constants.SET_ID_ISSUING_COUNTRY; payload: CountryData }
  | { type: typeof constants.RESET_ID_ISSUING_COUNTRY }
  | { type: typeof constants.SET_POA_DOCUMENT_TYPE; payload: PoaTypes }
  | { type: typeof constants.SET_POA_DOCUMENT_COUNTRY; payload: CountryData }
  | { type: typeof constants.RESET_POA_DOCUMENT_COUNTRY }
  | { type: typeof constants.SET_ROOM_ID; payload: string }
  | { type: typeof constants.SET_SOCKET; payload: Socket }
  | { type: typeof constants.SET_MOBILE_NUMBER; payload: SmsPayload }
  | { type: typeof constants.SET_CLIENT_SUCCESS; payload: boolean }
  | { type: typeof constants.MOBILE_CONNECTED; payload: boolean }
  | { type: typeof constants.ACCEPT_TERMS }
  | { type: typeof constants.SET_NAVIGATION_DISABLED; payload: boolean }
  | { type: typeof constants.SET_FULL_SCREEN; payload: boolean }
  | { type: typeof constants.SET_DEVICE_HAS_CAMERA_SUPPORT; payload: boolean }
  | { type: typeof constants.SET_URLS; payload: UrlsConfig }
  | { type: typeof constants.SET_TOKEN; payload: string }
  | { type: typeof constants.SET_APPLICANT_UUID; payload: string }
  | { type: typeof constants.SET_CLIENT_UUID; payload: string }
  | {
      type: typeof constants.SET_STEPS_CONFIG
      payload: StepConfig[]
    }
  | { type: typeof constants.SET_IS_CROSS_DEVICE_CLIENT; payload: boolean }
  | {
      type: typeof constants.SET_CROSS_DEVICE_CLIENT_INTRO_PRODUCT_NAME
      payload: string
    }
  | {
      type: typeof constants.SET_CROSS_DEVICE_CLIENT_INTRO_PRODUCT_LOGO_SRC
      payload: string
    }
  | { type: typeof constants.SET_ANALYTICS_SESSION_UUID; payload: string }
  | { type: typeof constants.SET_ANONYMOUS_UUID; payload: string }
  | { type: typeof constants.HIDE_ONFIDO_LOGO; payload: boolean }
  | { type: typeof constants.SHOW_COBRANDING; payload: EnterpriseCobranding }
  | {
      type: typeof constants.SHOW_LOGO_COBRANDING
      payload: EnterpriseLogoCobranding
    }
  | { type: typeof constants.SET_DECOUPLE_FROM_API; payload: boolean }
  | { type: typeof constants.RETRY_FOR_IMAGE_QUALITY }
  | { type: typeof constants.RESET_IMAGE_QUALITY_RETRIES }
  | { type: typeof constants.SET_SDK_CONFIGURATION; payload: SdkConfiguration }
  | { type: typeof constants.RESET_STORE }

export type GlobalState = {
  currentStepType?: ExtendedStepTypes
  documentType?: DocumentTypes
  idDocumentIssuingCountry?: CountryData
  poaDocumentCountry?: CountryData
  poaDocumentType?: PoaTypes
  roomId?: string
  socket?: Socket
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
  crossDeviceClientIntroProductName?: string
  crossDeviceClientIntroProductLogoSrc?: string
  isDecoupledFromAPI?: boolean
  urls: UrlsConfig
  /**
   * Number of retries on image quality reasons: cut-off, glare, blur
   * If the API returns an error on one of those reasons, increase this state by 1 and ask for redo
   * After at most <MAX_IMAGE_QUALITY_RETRIES_WITH_ERROR> retries, the user will be allowed to proceed, as any image quality related validation from this point on will be treated as a warning.
   */
  imageQualityRetries: number
  analyticsSessionUuid?: string
  token?: string
  isCrossDeviceClient?: boolean
  applicantUuid?: string
  anonymousUuid?: string
  clientUuid?: string
  stepsConfig: Array<StepConfig>
  sdkConfiguration?: SdkConfiguration
}
