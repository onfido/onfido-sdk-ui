import { createSelector } from 'reselect'
import { mapValues, every } from '../../utils/func.js'
import { createSelectorWhichMapsToHash } from './utils.js'

const captures = state => state.captures
const createSelectorWhichMapsToCaptures = (mapFunc) =>
        createSelectorWhichMapsToHash(captures, mapFunc)

export const isThereAValidCapture = createSelectorWhichMapsToCaptures(capturesOfAType =>
  capturesOfAType.some(i => i.valid))

export const isThereAValidAndConfirmedCapture = createSelectorWhichMapsToCaptures(capturesOfAType =>
  capturesOfAType.some(i => i.valid && i.confirmed))

export const validCaptures = createSelectorWhichMapsToCaptures(capturesOfAType =>
  capturesOfAType.filter(i => i.valid))

export const unprocessedCaptures = createSelectorWhichMapsToCaptures(capturesOfAType =>
    capturesOfAType.filter(i => !i.processed))

export const hasUnprocessedCaptures= createSelectorWhichMapsToCaptures( capturesOfAType =>
    capturesOfAType.some(i => !i.processed))

export const areAllCapturesInvalid = createSelectorWhichMapsToCaptures(capturesOfAType =>
    capturesOfAType.length > 0 && capturesOfAType.every(i => i.processed && !i.valid))

export const allCaptured = createSelector(
  isThereAValidAndConfirmedCapture,
  obj => every(obj, i => i)
)

export const captureSelector = createSelector(
  validCaptures,
  validCapturesValue =>
        mapValues(validCapturesValue, ([firstCapture]) => firstCapture)
)
