import type { CaptureMethods, DocumentSides } from '~types/commons'
import type { RequestedVariant } from '~types/steps'
import type { CaptureState } from '~types/redux'

export const buildCaptureStateKey = (payload: {
  method?: CaptureMethods
  side?: DocumentSides
  variant?: RequestedVariant
}): keyof CaptureState => {
  const { method, side, variant } = payload

  if (method === 'face') return 'face'
  if (variant === 'video') return 'document_video'
  return side === 'back' ? 'document_back' : 'document_front'
}
