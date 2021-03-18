import { DocumentSides } from './commons'

export type CaptureVariants = DocumentSides | 'video'

export type CaptureFlows = 'passport' | 'cardId'

export type CaptureSteps = 'intro' | 'front' | 'back'

export type CaptureActions = 'NEXT_RECORD_STATE' | 'NEXT_STEP' | 'RESET_STEP'

export type RecordState =
  | 'hideButton'
  | 'showButton'
  | 'holdingStill'
  | 'success'
