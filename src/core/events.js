import EventEmitter from 'eventemitter2'
import store from '../store/store'
import * as selectors from '../store/selectors'
import { createValuesHashToValueSelector } from '../store/selectors/utils'
import { mapKeys } from '../utils/func.js'
import { subcribeByWatching } from './utils'

const events = new EventEmitter()

//these methods have been bounded to their object, since they will be used
//more than once and inside of other functions too
const getState = () => store.getState()
const getCaptures = ()=> selectors.captureSelector(getState())

const getCapturesCompatible = ()=> mapKeys(getCaptures(), key => key + 'Capture')

const subscribe = store.subscribe.bind(store)
//this function allows to subscribe to a selector and listen for when it changes
const subcribeToStoreByWatching = subcribeByWatching(getState, subscribe)


const emitIfCaptureValueTrue = (captureType, eventSufix) => captureValue => {
  if (captureValue) events.emit(captureType+eventSufix, getCaptures()[captureType])
}

const subscribeToCaptureValueAndEmit = (captureHashValueSelector, eventSuffix) => captureType =>
        subcribeToStoreByWatching(createValuesHashToValueSelector(captureHashValueSelector, captureType),
                                  emitIfCaptureValueTrue(captureType, eventSuffix))

const subcribeToConfirmedCapture =
        subscribeToCaptureValueAndEmit(selectors.isThereAValidAndConfirmedCapture, 'Capture')

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
