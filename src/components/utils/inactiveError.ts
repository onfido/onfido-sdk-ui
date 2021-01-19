import type { ErrorTypes } from '~types/commons'

export const getInactiveError = (
  isUploadFallbackDisabled: boolean
): { name: ErrorTypes; type: string } => ({
  name: isUploadFallbackDisabled
    ? 'CAMERA_INACTIVE_NO_FALLBACK'
    : 'CAMERA_INACTIVE',
  type: 'warning',
})
