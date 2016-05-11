import EventEmitter from 'eventemitter2'
import store from '../store/store'

const events = new EventEmitter()
store.subscribe(handleEvent)

const authenticated = (state) => state.globals.authenticated
const hasDocumentCaptured = (state) => state.globals.hasDocumentCaptured
const hasFaceCaptured = (state) => state.globals.hasFaceCaptured

function handleEvent() {
  const state = store.getState()
  if (authenticated(state)) {
    events.emit('ready')
  }
  if (hasDocumentCaptured(state)) {
    const { documentCaptures } = state
    events.emit('documentCapture', { documentCaptures })
  }
  if (hasFaceCaptured(state)) {
    const { faceCaptures } = state
    events.emit('faceCapture', { faceCaptures })
  }
  if (hasDocumentCaptured(state) && hasFaceCaptured(state)) {
    const { documentCaptures, faceCaptures } = state
    events.emit('complete', { documentCaptures, faceCaptures })
  }
}

export default events
