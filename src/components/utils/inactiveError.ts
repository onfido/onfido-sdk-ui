import type { ErrorNames, ErrorTypes } from '~types/commons'

export const getInactiveError = (
  isUploadFallbackDisabled: boolean
): { name: ErrorNames; type: ErrorTypes } => ({
  name: isUploadFallbackDisabled
    ? 'CAMERA_INACTIVE_NO_FALLBACK'
    : 'CAMERA_INACTIVE',
  type: 'warning',
})
