import type { CaptureMethods, DocumentSides } from '~types/commons'
import type { RequestedVariant } from '~types/steps'
import type { CaptureState } from '~types/redux'

export const buildCaptureStateKey = (payload: {
  method?: CaptureMethods
  side?: DocumentSides
  variant?: RequestedVariant
}): Exclude<keyof CaptureState, 'takesHistory'> => {
  const { method, side, variant } = payload

  if (method === 'poa') return 'poa'
  if (method === 'face') return 'face'
  if (method === 'activeVideo') return 'active_video'
  if (variant === 'video') return 'document_video'

  return side === 'back' ? 'document_back' : 'document_front'
}
