import { createSelector } from 'reselect'
import mapValues from 'object-loops/map'

const currentCaptures = (state, props) => {
  const method = props.method
  const side = props.side ? props.side : null
  return state.captures[method].filter(c => c.side === side)
}

const outputCaptures = (state) => {
  const captures = state.captures
  const outputCaptures = {}
  outputCaptures.face = captures.face
  outputCaptures.document = captures.document.filter(c => c.side === 'front')
  outputCaptures.documentBack = captures.document.filter(c => c.side === 'back')
  return outputCaptures
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
