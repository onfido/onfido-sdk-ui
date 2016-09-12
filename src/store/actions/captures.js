import * as constants from '../../constants'

export function createCapture(payload) {
  return {
    type: constants.CAPTURE_CREATE,
    payload
  }
}

export function validCapture(payload) {
  return {
    type: constants.CAPTURE_VALID,
    payload
  }
}

export function confirmCaptures(payload) {
  return {
    type: constants.CAPTURE_CONFIRM,
    payload
  }
}

export function deleteCaptures(payload) {
  return {
    type: constants.CAPTURE_DELETE,
    payload
  }
}
