import { ErrorNames } from '~types/commons'
import { TrackScreenCallback } from '~types/hocs'
import { ErrorProp } from '~types/routers'
import { ErrorNameToUIAlertMapping } from '~types/tracker'
import { lowerCase } from '~utils/string'

const DOCUMENT_TRACKING_ERRORS: Array<ErrorNames> = [
  'BLUR_DETECTED',
  'GLARE_DETECTED',
  'CUTOFF_DETECTED',
  'DOCUMENT_DETECTION',
]

const isDocumentTrackingError = (error: ErrorNames) =>
  DOCUMENT_TRACKING_ERRORS.includes(error)

const trackDocumentError = (
  error: ErrorProp,
  trackScreen: TrackScreenCallback
) => {
  if (error.type === 'warning') {
    trackScreen(lowerCase(error.name + '_warning'), {
      ...error.properties,
      ...error.analyticsProperties,
    })
    return
  }

  // keep default behaviour for error and undefined type
  trackScreen(lowerCase(error.name), error.properties)
}

export { isDocumentTrackingError, trackDocumentError }
