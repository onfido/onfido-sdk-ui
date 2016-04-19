const {createStore} = require('redux')
const reducer = require('./reducers/reducers')

const store = createStore(reducer,
  window.devToolsExtension ? window.devToolsExtension() : undefined
)

module.exports = store
