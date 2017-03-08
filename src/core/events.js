import EventEmitter from 'eventemitter2'
import store from '../store/store'
import * as selectors from '../store/selectors'
import { createValuesHashToValueSelector } from '../store/selectors/utils'
import { mapKeys } from '../utils/func.js'
import { subscribeByWatching } from './utils'

const events = new EventEmitter()

//these methods have been bounded to their object, since they will be used
//more than once and inside of other functions too
const getState = () => store.getState()
const getCaptures = ()=> selectors.validCaptures(getState())

const getCapturesCompatible = ()=> mapKeys(getCaptures(), key => key + 'Capture')

const subscribe = store.subscribe.bind(store)
//this function allows to subscribe to a selector and listen for when it changes
const subscribeToStoreByWatching = subscribeByWatching(getState, subscribe)


const emitIfCaptureValueTrue = (captureType, eventSuffix) => captureValue => {
  if (captureValue) events.emit(captureType+eventSuffix, getCaptures()[captureType])
}

const subscribeToCaptureValueAndEmit = (captureHashValueSelector, eventSuffix) => captureType =>
        subscribeToStoreByWatching(createValuesHashToValueSelector(captureHashValueSelector, captureType),
                                  emitIfCaptureValueTrue(captureType, eventSuffix))

const subscribeToConfirmedCapture =
        subscribeToCaptureValueAndEmit(selectors.isThereAValidAndConfirmedCapture, 'Capture')

subscribeToConfirmedCapture('document')
subscribeToConfirmedCapture('face')


subscribeToStoreByWatching( selectors.allCaptured, allCaptured => {
  if (allCaptured) events.emit('complete', getCapturesCompatible())
})

subscribeToStoreByWatching( state => state.globals.authenticated, isAuthenticated => {
  if (isAuthenticated) events.emit('ready')
})


events.getCaptures = getCapturesCompatible

export default events
