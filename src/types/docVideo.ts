import { DocumentSides } from './commons'

export type CaptureVariants = DocumentSides | 'video'

export type CaptureFlows = 'passport' | 'cardId'

export type CaptureSteps = 'intro' | 'front' | 'back'

export type RecordState =
  | 'hideButton'
  | 'showButton'
  | 'holdingStill'
  | 'success'

export type InstructionLocale = {
  title: string
  subtitle?: string
  button: string
}
