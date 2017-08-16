import EventEmitter from 'eventemitter2'
import store from '../store/store'
import * as selectors from '../store/selectors'

const events = new EventEmitter()

//these methods have been bounded to their object, since they will be used
//more than once and inside of other functions too
const getState = () => store.getState()
const getCaptures = ()=> selectors.confirmedCaptures(getState())
events.getCaptures = getCaptures

export default events
