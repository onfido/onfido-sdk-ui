function documentCapture(data) {
  return {
    type: 'DOCUMENT_CAPTURE',
    data
  }
}

function faceCapture(data) {
  return {
    type: 'FACE_CAPTURE',
    data
  }
}

module.exports = {
  documentCapture,
  faceCapture
}
