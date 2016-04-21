const connect = require('./connect/connect')
const store = require('./store/store')
const events = require('./core/events')
const {actions, unboundActions} = require('./store/actions/actions')

module.exports = {
  Onfido: {
    connect,
    store,
    actions,
    events,
    unboundActions
  }
}
