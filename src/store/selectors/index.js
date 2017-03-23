import { createSelector } from 'reselect'
import mapValues from 'object-loops/map'

const currentCaptures = (state, { method, side = null }) =>
  state.captures[method].filter(c => c.side === side)

const outputCaptures = (state) => {
  const captures = state.captures
  return {
    face: captures.face,
    document: captures.document.filter(c => c.side === 'front'),
    documentBack: captures.document.filter(c => c.side === 'back')
  }
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

const validCaptures = createSelector(
  outputCaptures,
  captures => mapValues(captures, value => value.filter(c => c.valid))
)

export const confirmedCaptures = createSelector(
  validCaptures,
  captures => mapValues(captures, value => value.find(c => c.confirmed))
)
