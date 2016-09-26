import { createSelector } from 'reselect'
import { mapValues, curry, every } from 'lodash'

const captures = state => state.captures

const mapValuesFlippedAndCurried = curry((mapFunc, objectToMap) => mapValues(objectToMap, mapFunc))

export const isThereAValidCapture = createSelector(
  captures,
  mapValuesFlippedAndCurried(capturesOfAType => capturesOfAType.some(i => i.valid))
)

export const isThereAValidAndConfirmedCapture = createSelector(
  captures,
  mapValuesFlippedAndCurried(capturesOfAType => capturesOfAType.some(i => i.valid && i.confirmed))
)

export const validCaptures = createSelector(
  captures,
  mapValuesFlippedAndCurried(capturesOfAType => capturesOfAType.filter(i => i.valid))
)

export const allCaptured = createSelector(
  isThereAValidAndConfirmedCapture,
  obj => every(obj, i => i)
)

export const captureSelector = createSelector(
  validCaptures,
  ({ document:validDocumentCaptures, face:validFaceCaptures }) => ({
    documentCapture: validDocumentCaptures[0],
    faceCapture: validFaceCaptures[0]
  })
)

export const unprocessedCaptures = createSelector(
  captures,
  mapValuesFlippedAndCurried(capturesOfAType =>
    capturesOfAType.filter(i => !i.processed))
)

export const hasUnprocessedCaptures= createSelector(
  captures,
  mapValuesFlippedAndCurried( capturesOfAType =>
    capturesOfAType.some(i => !i.processed)
))

export const areAllCapturesInvalid = createSelector(
  captures,
  mapValuesFlippedAndCurried(capturesOfAType =>
    capturesOfAType.length > 0 && capturesOfAType.every(i => i.processed && !i.valid)
  )
)
