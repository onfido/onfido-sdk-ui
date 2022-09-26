import { DocumentSides } from './commons'

export type CaptureVariants = DocumentSides | 'video'

export type CaptureFlows = 'passport' | 'cardId' | 'paperId'

export type CaptureSteps = 'intro' | 'front' | 'back'

export type RecordState = 'hideButton' | 'showButton' | 'holdStill' | 'success'

export type InstructionLocale = {
  title: string
  subtitle?: string
  button: string
}
