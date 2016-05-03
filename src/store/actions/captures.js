export function documentCapture(payload) {
  return {
    type: 'DOCUMENT_CAPTURE',
    payload
  }
}

export function faceCapture(payload) {
  return {
    type: 'FACE_CAPTURE',
    payload
  }
}
