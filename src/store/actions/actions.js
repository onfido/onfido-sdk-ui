const {bindActionCreators} = require('redux')
const store = require('../store')
const globals = require('./globals')
const captures = require('./captures')

const unboundActions = Object.assign({}, globals, captures)
const boundActions = bindActionCreators(unboundActions, store.dispatch)

module.exports = {
  unboundActions,
  boundActions
}
