import * as constants from '../../constants'

export function documentCapture(payload) {
  return {
    type: constants.DOCUMENT_CAPTURE,
    payload
  }
}

export function captureIsValid(payload) {
  return {
    type: constants.CAPTURE_IS_VALID,
    payload
  }
}

export function faceCapture(payload) {
  return {
    type: constants.FACE_CAPTURE,
    payload
  }
}
