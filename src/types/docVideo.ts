import { DocumentSides } from './commons'

export type CaptureSteps = 'intro' | 'front' | 'tilt' | 'back' | 'complete'
export type CaptureVariants = DocumentSides | 'video'
export type TiltModes = 'left' | 'right'

export const TILT_MODE: TiltModes = 'left'
