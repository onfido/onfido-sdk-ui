import EventEmitter from 'eventemitter2'
import store from '../store/store'
import { actions } from '../store/actions'
import * as selectors from '../store/selectors'

const events = new EventEmitter()
store.subscribe(handleEvent)

const authenticated = (state) => state.globals.authenticated

function handleEvent () {
  const state = store.getState()
  const data = selectors.captureSelector(state)
  if (authenticated(state)) {
    events.emit('ready')
  }
  if (selectors.documentCaptured(state)) {
    events.emit('documentCapture', data)
  }
  if (selectors.faceCaptured(state)) {
    events.emit('faceCapture', data)
  }
  if (selectors.allCaptured(state)) {
    events.emit('complete', data)
  }
}

events.getCaptures = () => captureSelector(store.getState())

export default events
