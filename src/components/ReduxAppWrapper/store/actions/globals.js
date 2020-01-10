import * as constants from '../../constants'

export function setIdDocumentType(payload) {
  return {
    type: constants.SET_ID_DOCUMENT_TYPE,
    payload
  }
}

export const setPoADocumentType = (payload) => {
  return {
    type: constants.SET_POA_DOCUMENT_TYPE,
    payload
  }
}

export function setRoomId(payload) {
  return {
    type: constants.SET_ROOM_ID,
    payload
  }
}

export function setSocket(payload) {
  return {
    type: constants.SET_SOCKET,
    payload
  }
}

export function setClientSuccess(payload) {
  return {
    type: constants.SET_CLIENT_SUCCESS,
    payload
  }
}

export function setMobileNumber(number, valid=false) {
  const payload = {
    number,
    valid
  }

  return {
    type: constants.SET_MOBILE_NUMBER,
    payload
  }
}

export function mobileConnected(payload) {
  return {
    type: constants.MOBILE_CONNECTED,
    payload
  }
}

export function acceptTerms() {
  return {
    type: constants.ACCEPT_TERMS
  }
}

export function setNavigationDisabled(payload) {
  return {
    type: constants.SET_NAVIGATION_DISABLED,
    payload
  }
}

export function setFullScreen(payload) {
  return {
    type: constants.SET_FULL_SCREEN,
    payload
  }
}

export const setDeviceHasCameraSupport = (payload) => ({
  type: constants.SET_DEVICE_HAS_CAMERA_SUPPORT,
  payload
})
