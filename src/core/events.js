import EventEmitter from 'eventemitter2'
import store from '../store/store'
import * as selectors from '../store/selectors'
import { createValuesHashToValueSelector } from '../store/selectors/utils'
import { createSelector } from 'reselect'
import watch from 'redux-watch'
import { mapKeys } from 'lodash'
import isEqual from 'deep-equal'


const subcribeByWatching = (getState, subscribe, selector, changeCallback)=>{
  const watcher = watch(()=>selector(getState()), null, isEqual)
  subscribe(watcher(changeCallback))
}

const events = new EventEmitter()


const getState = () => store.getState()
const getCaptures = ()=> selectors.captureSelector(getState())
const getCapturesCompatible = ()=> mapKeys(getCaptures(), (v, key) => key + 'Capture')

const subscribe = store.subscribe.bind(store)
const subcribeToStoreByWatching = subcribeByWatching.bind(this, getState, subscribe )


const emitIfCaptureValueTrue = (captureType, eventSufix, captureValue) => {
  if (captureValue) events.emit(captureType+eventSufix, getCaptures()[captureType])
}

const subscribeToCaptureValueAndEmit = (captureHashValueSelector, eventSuffix, captureType) =>
  subcribeToStoreByWatching(createValuesHashToValueSelector(captureHashValueSelector, captureType),
                            emitIfCaptureValueTrue.bind(this, captureType, eventSuffix) )

const subcribeToConfirmedCapture =
        subscribeToCaptureValueAndEmit.bind(this, selectors.isThereAValidAndConfirmedCapture, 'Capture')

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
