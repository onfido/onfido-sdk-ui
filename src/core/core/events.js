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

events.getCaptures = getCapturesCompatible

export default events
