import { createSelector } from 'reselect'
import { mapValues, every } from '../../utils/func.js'
import { createSelectorWhichMapsToHash } from './utils.js'

const captures = state => state.captures
const createSelectorWhichMapsToCaptures = (mapFunc) =>
  createSelectorWhichMapsToHash(captures, mapFunc)

const currentCaptures = (state, props) => {
  const method = props.method
  const side = props.side ? props.side : null
  return state.captures[method].filter(c => c.side === side)
}

export const currentValidCaptures = createSelector(
  currentCaptures,
  captures => captures.filter(capture => capture.valid)
)

export const unprocessedCaptures = createSelector(
  currentCaptures,
  captures => captures.filter(capture => !capture.processed)
)

export const allInvalidCaptureSelector = createSelector(
  currentCaptures,
  captures => captures.length > 0 && captures.every(c => c.processed && !c.valid)
)

export const isThereAValidAndConfirmedCapture = createSelectorWhichMapsToCaptures(capturesOfAType =>
  capturesOfAType.some(i => i.valid && i.confirmed))

export const allCaptured = createSelector(
  isThereAValidAndConfirmedCapture,
  obj => every(obj, i => i)
)

export const validCaptures = (state) => {
  const captures = state.captures
  const validCaptures = {}
  validCaptures.face = captures.face.find(c => c.valid)
  validCaptures.document = captures.document.find(c => c.valid && c.side === 'front')
  validCaptures.documentBack = captures.document.find(c => c.valid && c.side === 'back')
  return validCaptures
}
