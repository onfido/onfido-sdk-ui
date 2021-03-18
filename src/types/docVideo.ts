import { DocumentSides } from './commons'

export type CaptureVariants = DocumentSides | 'video'

export type CaptureFlows = 'passport' | 'cardId' | 'paperId'

export type CaptureSteps = 'intro' | 'front' | 'back'

export type RecordState =
  | 'hideButton'
  | 'showButton'
  | 'holdingStill'
  | 'success'

export type RecordActions = 'NEXT_RECORD_STATE' | 'NEXT_STEP'
