import * as constants from '~types/redux/constants'

import type { CountryData, UrlsConfig } from '~types/commons'
import type { EnterpriseCobranding } from '~types/enterprise'
import type { GlobalActions } from '~types/redux'
import type { DocumentTypes, PoaTypes } from '~types/steps'

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

export const setRoomId = (payload: string): GlobalActions => ({
  type: constants.SET_ROOM_ID,
  payload,
})

export const setSocket = (payload: SocketIOClient.Socket): GlobalActions => ({
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

export const retryForImageQuality = (): GlobalActions => ({
  type: constants.RETRY_FOR_IMAGE_QUALITY,
})

export const resetImageQualityRetries = (): GlobalActions => ({
  type: constants.RESET_IMAGE_QUALITY_RETRIES,
})
