export const getInactiveError = isUploadFallbackDisabled => ({
  name: isUploadFallbackDisabled ? 'CAMERA_INACTIVE_NO_FALLBACK' : 'CAMERA_INACTIVE',
  type: 'warning'
})
