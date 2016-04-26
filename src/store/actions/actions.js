const {bindActionCreators} = require('redux')
const objectAssign = require('object-assign')
const store = require('../store')
const globals = require('./globals')
const captures = require('./captures')

const unboundActions = objectAssign({}, globals, captures)
const actions = bindActionCreators(unboundActions, store.dispatch)

module.exports = {
  unboundActions,
  actions
}
