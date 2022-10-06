import * as constants from '~types/redux/constants'

import type { CountryData, UrlsConfig, ExtendedStepTypes } from '~types/commons'
import type {
  EnterpriseCobranding,
  EnterpriseLogoCobranding,
} from '~types/enterprise'
import type { GlobalActions } from '~types/redux'
import type { DocumentTypes, PoaTypes, StepConfig } from '~types/steps'
import type { Socket } from 'socket.io-client'

export const setCurrentStepType = (
  payload: ExtendedStepTypes
): GlobalActions => ({
  type: constants.SET_CURRENT_STEP_TYPE,
  payload,
})

export const setIdDocumentType = (payload: DocumentTypes): GlobalActions => ({
  type: constants.SET_ID_DOCUMENT_TYPE,
  payload,
})

export const setIdDocumentIssuingCountry = (
  payload: CountryData
): GlobalActions => ({
  type: constants.SET_ID_ISSUING_COUNTRY,
  payload,
})

export const resetIdDocumentIssuingCountry = (): GlobalActions => ({
  type: constants.RESET_ID_ISSUING_COUNTRY,
})

export const setPoADocumentType = (payload: PoaTypes): GlobalActions => ({
  type: constants.SET_POA_DOCUMENT_TYPE,
  payload,
})

export const setPoADocumentCountry = (payload: CountryData): GlobalActions => ({
  type: constants.SET_POA_DOCUMENT_COUNTRY,
  payload,
})

export const resetPoADocumentCountry = (): GlobalActions => ({
  type: constants.RESET_POA_DOCUMENT_COUNTRY,
})

export const setRoomId = (payload: string): GlobalActions => ({
  type: constants.SET_ROOM_ID,
  payload,
})

export const setSocket = (payload: Socket): GlobalActions => ({
  type: constants.SET_SOCKET,
  payload,
})

export const setClientSuccess = (payload: boolean): GlobalActions => ({
  type: constants.SET_CLIENT_SUCCESS,
  payload,
})

export const setMobileNumber = (
  number: string,
  valid = false
): GlobalActions => ({
  type: constants.SET_MOBILE_NUMBER,
  payload: { number, valid },
})

export const mobileConnected = (payload: boolean): GlobalActions => ({
  type: constants.MOBILE_CONNECTED,
  payload,
})

export const acceptTerms = (): GlobalActions => ({
  type: constants.ACCEPT_TERMS,
})

export const setNavigationDisabled = (payload: boolean): GlobalActions => ({
  type: constants.SET_NAVIGATION_DISABLED,
  payload,
})

export const setFullScreen = (payload: boolean): GlobalActions => ({
  type: constants.SET_FULL_SCREEN,
  payload,
})

export const setDeviceHasCameraSupport = (payload: boolean): GlobalActions => ({
  type: constants.SET_DEVICE_HAS_CAMERA_SUPPORT,
  payload,
})

export const setUrls = (payload: UrlsConfig): GlobalActions => ({
  type: constants.SET_URLS,
  payload,
})

export const hideOnfidoLogo = (payload: boolean): GlobalActions => ({
  type: constants.HIDE_ONFIDO_LOGO,
  payload,
})

export const showCobranding = (
  payload: EnterpriseCobranding
): GlobalActions => ({
  type: constants.SHOW_COBRANDING,
  payload,
})

export const showLogoCobranding = (
  payload: EnterpriseLogoCobranding
): GlobalActions => ({
  type: constants.SHOW_LOGO_COBRANDING,
  payload,
})

export const setCrossDeviceClientIntroProductName = (
  payload: string
): GlobalActions => ({
  type: constants.SET_CROSS_DEVICE_CLIENT_INTRO_PRODUCT_NAME,
  payload,
})

export const setCrossDeviceClientIntroProductLogoSrc = (
  payload: string
): GlobalActions => ({
  type: constants.SET_CROSS_DEVICE_CLIENT_INTRO_PRODUCT_LOGO_SRC,
  payload,
})

export const setDecoupleFromAPI = (payload: boolean): GlobalActions => ({
  type: constants.SET_DECOUPLE_FROM_API,
  payload,
})

export const retryForImageQuality = (): GlobalActions => ({
  type: constants.RETRY_FOR_IMAGE_QUALITY,
})

export const resetImageQualityRetries = (): GlobalActions => ({
  type: constants.RESET_IMAGE_QUALITY_RETRIES,
})

export const setAnalyticsSessionUuid = (payload: string): GlobalActions => ({
  type: constants.SET_ANALYTICS_SESSION_UUID,
  payload,
})

export const setAnonymousUuid = (payload: string): GlobalActions => ({
  type: constants.SET_ANONYMOUS_UUID,
  payload,
})

export const setToken = (payload: string): GlobalActions => ({
  type: constants.SET_TOKEN,
  payload,
})

export const setApplicantUuid = (payload: string): GlobalActions => ({
  type: constants.SET_APPLICANT_UUID,
  payload,
})

export const setClientUuid = (payload: string): GlobalActions => ({
  type: constants.SET_CLIENT_UUID,
  payload,
})

export const setIsTrial = (payload: boolean): GlobalActions => ({
  type: constants.SET_IS_TRIAL,
  payload,
})

export const setStepsConfig = (payload: StepConfig[]): GlobalActions => ({
  type: constants.SET_STEPS_CONFIG,
  payload,
})

export const setIsCrossDeviceClient = (payload: boolean): GlobalActions => ({
  type: constants.SET_IS_CROSS_DEVICE_CLIENT,
  payload,
})
