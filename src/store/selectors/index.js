import { createSelector } from 'reselect'

const documentCaptures = state => state.captures.document
const faceCaptures = state => state.captures.face

export const documentCaptured = createSelector(
  documentCaptures,
  documents => documents.some(i => i.valid)
)

export const documentValidAndConfirmed= createSelector(
  documentCaptures,
  documents => documents.some(i => i.valid && i.confirmed)
)

export const documentSelector = createSelector(
  documentCaptures,
  documents => documents.filter(i => i.valid)
)

export const faceCaptured = createSelector(
  faceCaptures,
  faces => faces.some(i => i.valid)
)

export const faceValidAndConfirmed= createSelector(
  faceCaptures,
  faces => faces.some(i => i.valid && i.confirmed)
)

export const faceSelector = createSelector(
  faceCaptures,
  faces => faces.filter(i => i.valid)
)

export const allCaptured = createSelector(
  documentValidAndConfirmed,
  faceValidAndConfirmed,
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
