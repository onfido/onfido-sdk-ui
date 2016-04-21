const EventEmitter = require('eventemitter2')
const store = require('../store/store')

const events = new EventEmitter()
const ready = store.subscribe(onReady)

function select(state) {
  return state.globals.authenticated
}

function onReady () {
  const isReady = select(store.getState())
  if (isReady) events.emit('onReady')
}

module.exports = events
