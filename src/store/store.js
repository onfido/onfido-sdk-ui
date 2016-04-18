const createStore = require('redux').createStore
const reducer = require('./reducers/reducers')

module.exports = createStore(reducer)
