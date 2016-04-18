const bindActionCreators = require('redux').bindActionCreators
const store = require('../store')
const actions = require('./documents')
module.exports = bindActionCreators(actions, store.dispatch)
