const combineReducers = require('redux').combineReducers
const documentCaptures = require('./documentCaptures')
const faceCaptures = require('./faceCaptures')
const data = require('./data')

module.exports = combineReducers({
  data,
  documentCaptures,
  faceCaptures
})
