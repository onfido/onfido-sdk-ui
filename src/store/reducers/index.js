import { combineReducers } from 'redux';
import { faceCaptures, documentCaptures } from './captures';
import globals from './globals';

export default combineReducers({
  globals,
  documentCaptures,
  faceCaptures
})
