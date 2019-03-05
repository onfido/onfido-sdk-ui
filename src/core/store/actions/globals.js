import * as constants from '../../constants'

export function setDocumentType(payload) {
  return {
    type: constants.SET_DOCUMENT_TYPE,
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

export function setFullScreen(payload) {
  return {
    type: constants.SET_FULL_SCREEN,
    payload
  }
}
