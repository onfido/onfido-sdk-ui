import EventEmitter from 'eventemitter2'
import store from '../store/store'
import { actions } from '../store/actions'

const events = new EventEmitter()
store.subscribe(handleEvent)

const authenticated = (state) => state.globals.authenticated
const hasDocumentCaptured = (state) => state.globals.hasDocumentCaptured
const hasFaceCaptured = (state) => state.globals.hasFaceCaptured

function handleEvent () {
  const state = store.getState()
  const { documentCaptures, faceCaptures } = state
  const data = {
    documentCaptures: documentCaptures[0] || null,
    faceCaptures: faceCaptures[0] || null
  }
  if (authenticated(state)) {
    events.emit('ready')
  }
  if (hasDocumentCaptured(state)) {
    events.emit('documentCapture', data)
  }
  if (hasFaceCaptured(state)) {
    events.emit('faceCapture', data)
  }
  if (hasDocumentCaptured(state) && hasFaceCaptured(state)) {
    events.emit('complete', data)
  }
}

events.getCaptures = () => {
  const state = store.getState()
  const { documentCaptures, faceCaptures } = state
  const filterValid = (capture) => capture.isValid
  const [ documentCapture ] = documentCaptures.filter(filterValid)
  const [ faceCapture ] = faceCaptures.filter(filterValid)
  const data = {
    documentCapture: (documentCapture || null),
    faceCapture: (faceCapture || null)
  }
  return data
}

export default events
