import { createSelector } from 'reselect'
import events from '../../core/events'

const documentCaptures = state => state.documentCaptures
const faceCaptures = state => state.faceCaptures

export const documentCaptured = createSelector(
  documentCaptures,
  documents => documents.some(i => i.isValid)
)

export const documentSelector = createSelector(
  documentCaptures,
  documents => documents.filter(i => i.isValid)
)

export const faceCaptured = createSelector(
  faceCaptures,
  faces => faces.some(i => i.isValid)
)

export const faceSelector = createSelector(
  faceCaptures,
  faces => faces.filter(i => i.isValid)
)

export const allCaptured = createSelector(
  documentCaptured,
  faceCaptured,
  (a, b) => [a, b].every(i => i)
)

export const captureSelector = createSelector(
  documentSelector,
  faceSelector,
  (documentCapture, faceCapture) => ({
    documentCapture: documentCapture[0],
    faceCapture: faceCapture[0]
  })
)
