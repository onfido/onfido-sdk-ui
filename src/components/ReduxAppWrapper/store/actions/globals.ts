import * as constants from '../../constants'
import type { EnterpriseCobranding } from '~types/enterprise'
import type {
  ActionType,
  ActionCreatorType,
  CountryPayload,
  SmsPayload,
  UrlsPayload,
} from '../../types'

export const setIdDocumentType: ActionCreatorType<string> = (payload) => ({
  type: constants.SET_ID_DOCUMENT_TYPE,
  payload,
})

export const setIdDocumentIssuingCountry: ActionCreatorType<CountryPayload> = (
  payload
) => ({
  type: constants.SET_ID_ISSUING_COUNTRY,
  payload,
})

export const resetIdDocumentIssuingCountry = (): ActionType<unknown> => ({
  type: constants.RESET_ID_ISSUING_COUNTRY,
})

export const setPoADocumentType: ActionCreatorType<string> = (payload) => ({
  type: constants.SET_POA_DOCUMENT_TYPE,
  payload,
})

export const setRoomId: ActionCreatorType<string> = (payload) => ({
  type: constants.SET_ROOM_ID,
  payload,
})

export const setSocket: ActionCreatorType<SocketIOClient.Socket> = (
  payload
) => ({
  type: constants.SET_SOCKET,
  payload,
})

export const setClientSuccess: ActionCreatorType<boolean> = (payload) => ({
  type: constants.SET_CLIENT_SUCCESS,
  payload,
})

export const setMobileNumber = (
  number: string,
  valid = false
): ActionType<SmsPayload> => ({
  type: constants.SET_MOBILE_NUMBER,
  payload: { number, valid },
})

export const mobileConnected: ActionCreatorType<boolean> = (payload) => ({
  type: constants.MOBILE_CONNECTED,
  payload,
})

export const acceptTerms = (): ActionType<unknown> => ({
  type: constants.ACCEPT_TERMS,
})

export const setNavigationDisabled: ActionCreatorType<boolean> = (payload) => ({
  type: constants.SET_NAVIGATION_DISABLED,
  payload,
})

export const setFullScreen: ActionCreatorType<boolean> = (payload) => ({
  type: constants.SET_FULL_SCREEN,
  payload,
})

export const setDeviceHasCameraSupport: ActionCreatorType<boolean> = (
  payload
) => ({
  type: constants.SET_DEVICE_HAS_CAMERA_SUPPORT,
  payload,
})

export const setUrls: ActionCreatorType<UrlsPayload> = (payload) => ({
  type: constants.SET_URLS,
  payload,
})

export const hideOnfidoLogo: ActionCreatorType<boolean> = (payload) => ({
  type: constants.HIDE_ONFIDO_LOGO,
  payload,
})

export const showCobranding: ActionCreatorType<EnterpriseCobranding> = (
  payload
) => ({
  type: constants.SHOW_COBRANDING,
  payload,
})

export const retryForImageQuality = (): ActionType<unknown> => ({
  type: constants.RETRY_FOR_IMAGE_QUALITY,
})

export const resetImageQualityRetries = (): ActionType<unknown> => ({
  type: constants.RESET_IMAGE_QUALITY_RETRIES,
})
