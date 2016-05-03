import EventEmitter from 'eventemitter2';
import store from '../store/store';

const events = new EventEmitter();
const subscriber = store.subscribe(handleEvent);

const authenticated = (state) => state.globals.authenticated;
const hasDocumentCaptured = (state) => state.globals.hasDocumentCaptured;
const hasFaceCaptured = (state) => state.globals.hasFaceCaptured;

function handleEvent () {
  const state = store.getState();
  if (authenticated(state)) {
    events.emit('ready');
  }
  if (hasDocumentCaptured(state)) {
    events.emit('documentCapture');
  }
  if (hasFaceCaptured(state)) {
    events.emit('faceCapture');
  }
}

export default events;
