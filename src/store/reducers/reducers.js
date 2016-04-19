const {combineReducers} = require('redux')
const {faceCaptures, documentCaptures} = require('./captures')
const globals = require('./globals')

module.exports = combineReducers({
  globals,
  documentCaptures,
  faceCaptures
})
