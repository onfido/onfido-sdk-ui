const EventEmitter = require('eventemitter2')
const store = require('../store/store')

const events = new EventEmitter()
const handle = store.subscribe(handleEvent)

const authenticated = (state) => state.globals.authenticated
const hasDocumentCaptured = (state) => state.globals.hasDocumentCaptured
const hasFaceCaptured = (state) => state.globals.hasFaceCaptured

function handleEvent () {
  const state = store.getState()
  console.log(state.globals)
  if (authenticated(state)) {
    events.emit('ready')
  }
  if (hasDocumentCaptured(state)) {
    events.emit('documentCapture')
  }
  if (hasFaceCaptured(state)) {
    events.emit('faceCapture')
  }
}

module.exports = events
