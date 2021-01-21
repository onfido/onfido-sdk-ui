import type { ErrorNames, ErrorTypes } from '~types/commons'

type ErrorProp = {
  name: ErrorNames
  type?: ErrorTypes
}

export const getInactiveError = (
  isUploadFallbackDisabled: boolean
): ErrorProp => ({
  name: isUploadFallbackDisabled
    ? 'CAMERA_INACTIVE_NO_FALLBACK'
    : 'CAMERA_INACTIVE',
  type: 'warning',
})
