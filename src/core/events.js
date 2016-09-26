import EventEmitter from 'eventemitter2'
import store from '../store/store'
import * as selectors from '../store/selectors'
import { each } from 'lodash'

const events = new EventEmitter()
store.subscribe(handleEvent)

const authenticated = (state) => state.globals.authenticated

function handleEvent() {
  const state = store.getState()
  const data = selectors.captureSelector(state)
  if (authenticated(state)) {
    events.emit('ready')
  }
  each(selectors.isThereAValidCapture(state), (isValid, captureType) => {
    if (isValid) events.emit(captureType+'Capture', data)
  })
  if (selectors.allCaptured(state)) {
    events.emit('complete', data)
  }
}

events.getCaptures = () => selectors.captureSelector(store.getState())

export default events
