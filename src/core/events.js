import EventEmitter from 'eventemitter2'
import store from '../store/store'
import * as selectors from '../store/selectors'
import { createValuesHashToValueSelector } from '../store/selectors/utils'
import { partial, mapKeys } from '../utils/func.js'
import { subcribeByWatching } from './utils'

const events = new EventEmitter()

const getState = () => store.getState()
const getCaptures = ()=> selectors.captureSelector(getState())
const getCapturesCompatible = ()=> mapKeys(getCaptures(), (v, key) => key + 'Capture')

const subscribe = store.subscribe.bind(store)
const subcribeToStoreByWatching = partial(subcribeByWatching, getState, subscribe)


const emitIfCaptureValueTrue = (captureType, eventSufix, captureValue) => {
  if (captureValue) events.emit(captureType+eventSufix, getCaptures()[captureType])
}

const subscribeToCaptureValueAndEmit = (captureHashValueSelector, eventSuffix, captureType) =>
  subcribeToStoreByWatching(createValuesHashToValueSelector(captureHashValueSelector, captureType),
                            partial(emitIfCaptureValueTrue, captureType, eventSuffix) )

const subcribeToConfirmedCapture =
        partial(subscribeToCaptureValueAndEmit, selectors.isThereAValidAndConfirmedCapture, 'Capture')

subcribeToConfirmedCapture('document')
subcribeToConfirmedCapture('face')


subcribeToStoreByWatching( selectors.allCaptured, allCaptured => {
  if (allCaptured) events.emit('complete', getCapturesCompatible())
})

subcribeToStoreByWatching( state => state.globals.authenticated, isAuthenticated => {
  if (isAuthenticated) events.emit('ready')
})


events.getCaptures = getCapturesCompatible

export default events
