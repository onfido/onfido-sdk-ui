const combineReducers = require('redux').combineReducers
const documents = require('./documents')
const data = require('./data')

module.exports = combineReducers({
  data,
  documents
})
