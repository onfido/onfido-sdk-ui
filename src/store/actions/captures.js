function documentCapture(payload) {
  return {
    type: 'DOCUMENT_CAPTURE',
    payload
  }
}

function faceCapture(payload) {
  return {
    type: 'FACE_CAPTURE',
    payload
  }
}

module.exports = {
  documentCapture,
  faceCapture
}
