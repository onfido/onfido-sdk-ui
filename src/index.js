const connect = require('./connect/connect')
const store = require('./store/store')
const actions = require('./store/actions/actions')
const supportsGetUserMedia = require('./utils/gum-detection')

module.exports = {
  connect,
  getState: store.getState,
  documentCapture: actions.documentCapture,
  faceCapture: actions.faceCapture,
  supportsGetUserMedia
}
