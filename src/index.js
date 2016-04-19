const onfidoConnect = require('./connect/connect')
const store = require('./store/store')
const {boundActions, unboundActions} = require('./store/actions/actions')
const supportsGetUserMedia = require('./utils/gum-detection')

module.exports = {
  store,
  boundActions,
  unboundActions,
  onfidoConnect,
  supportsGetUserMedia
}
