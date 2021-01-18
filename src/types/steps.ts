export type StepTypes = 'welcome' | 'document' | 'poa' | 'face' | 'complete'
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

type StepConfigBase = {
  type: StepTypes
}

type StepOptionWelcome = {
  title?: string
  descriptions?: string[]
  nextButton?: string
}

type DocumentTypeConfig =
  | boolean
  | {
      country: string
    }

type StepOptionDocument = {
  documentTypes?: Partial<Record<DocumentTypes, DocumentTypeConfig>>
  showCountrySelection?: boolean
  forceCrossDevice?: boolean
  useLiveDocumentCapture?: boolean
  uploadFallback?: boolean
  useWebcam?: boolean
}

type StepOptionPoA = {
  country?: string
  documentTypes?: Partial<Record<PoaTypes, boolean>>
}

type StepOptionFace = {
  requestedVariant?: 'standard' | 'video'
  uploadFallback?: boolean
  useMultipleSelfieCapture?: boolean
}

type StepOptionComplete = {
  message?: string
  submessage?: string
}

export type StepConfigWelcome = {
  options?: StepOptionWelcome
} & StepConfigBase

export type StepConfigDocument = {
  options?: StepOptionDocument
} & StepConfigBase

export type StepConfigPoA = {
  options?: StepOptionPoA
} & StepConfigBase

export type StepConfigFace = {
  options?: StepOptionFace
} & StepConfigBase

export type StepConfigComplete = {
  options?: StepOptionComplete
} & StepConfigBase

export type StepConfig =
  | StepConfigWelcome
  | StepConfigDocument
  | StepConfigPoA
  | StepConfigFace
  | StepConfigComplete
