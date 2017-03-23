import EventEmitter from 'eventemitter2'
import store from '../store/store'
import watch from 'redux-watch'
import isEqual from 'deep-equal'
import mapKeys from 'object-loops/map-keys'
import * as selectors from '../store/selectors'

const events = new EventEmitter()

//these methods have been bounded to their object, since they will be used
//more than once and inside of other functions too
const getState = () => store.getState()
const getCaptures = ()=> selectors.confirmedCaptures(getState())

const getCapturesCompatible = () => mapKeys(getCaptures(), key => key + 'Capture')

const subscribe = store.subscribe.bind(store)

const subscribeByWatching = (getState, subscribe) => (selector, changeCallback) => {
  const watcher = watch(()=>selector(getState()), null, isEqual)
  subscribe(watcher(changeCallback))
}

//this function allows to subscribe to a selector and listen for when it changes
const subscribeToStoreByWatching = subscribeByWatching(getState, subscribe)

const captureCallback = ({ document, documentBack, face }) => {
  if (document) events.emit('documentCapture', document)
  if (documentBack) events.emit('documentBackCapture', documentBack)
  if (face) events.emit('faceCapture', face)
}

// The result of the selector is passed to the callback.
subscribeToStoreByWatching(selectors.confirmedCaptures, captureCallback)

subscribeToStoreByWatching(state => state.globals.authenticated, isAuthenticated => {
  if (isAuthenticated) events.emit('ready')
})


events.getCaptures = getCapturesCompatible

export default events
