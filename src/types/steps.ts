const STEP_WELCOME = 'welcome'
const STEP_DOCUMENT = 'document'
const STEP_POA = 'poa'
const STEP_FACE = 'face'
const STEP_COMPLETE = 'complete'

export type StepTypes =
  | typeof STEP_WELCOME
  | typeof STEP_DOCUMENT
  | typeof STEP_POA
  | typeof STEP_FACE
  | typeof STEP_COMPLETE

export type DocumentTypes =
  | 'passport'
  | 'driving_licence'
  | 'national_identity_card'
  | 'residence_permit'

export type PoaTypes =
  | 'bank_building_society_statement'
  | 'utility_bill'
  | 'council_tax'
  | 'benefit_letters'
  | 'government_letter'

export type RequestedVariant = 'standard' | 'video'

export type DocumentTypeConfig =
  | boolean
  | {
      country: string
    }

export type CaptureOptions = {
  requestedVariant?: RequestedVariant
  uploadFallback?: boolean
  useUploader?: boolean
  useWebcam?: boolean
}

export type StepOptionWelcome = {
  title?: string
  descriptions?: string[]
  nextButton?: string
}

export type StepOptionDocument = {
  documentTypes?: Partial<Record<DocumentTypes, DocumentTypeConfig>>
  forceCrossDevice?: boolean
  showCountrySelection?: boolean
  useLiveDocumentCapture?: boolean
} & CaptureOptions

export type StepOptionPoA = {
  country?: string
  documentTypes?: Partial<Record<PoaTypes, boolean>>
}

export type StepOptionFace = {
  useMultipleSelfieCapture?: boolean
} & CaptureOptions

export type StepOptionComplete = {
  message?: string
  submessage?: string
}

export type StepConfigWelcome = {
  type: typeof STEP_WELCOME
  options?: StepOptionWelcome
}

export type StepConfigDocument = {
  type: typeof STEP_DOCUMENT
  options?: StepOptionDocument
}

export type StepConfigPoA = {
  type: typeof STEP_POA
  options?: StepOptionPoA
}

export type StepConfigFace = {
  type: typeof STEP_FACE
  options?: StepOptionFace
}

export type StepConfigComplete = {
  type: typeof STEP_COMPLETE
  options?: StepOptionComplete
}

export type StepConfig =
  | StepConfigWelcome
  | StepConfigDocument
  | StepConfigPoA
  | StepConfigFace
  | StepConfigComplete
