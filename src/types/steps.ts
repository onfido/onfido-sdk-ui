export type StepTypes = 'welcome' | 'document' | 'poa' | 'face' | 'complete'

type StepConfigBase = {
  type: StepTypes
}

type StepOptionWelcome = {
  title?: string
  descriptions?: string[]
  nextButton?: string
}

type StepOptionDocument = {
  documentTypes?: {
    passport?: boolean
    driving_licence?: boolean
    national_identity_card?: boolean
    residence_permit?: boolean
  }
  showCountrySelection?: boolean
  forceCrossDevice?: boolean
  useLiveDocumentCapture?: boolean
  uploadFallback?: boolean
  useWebcam?: boolean
}

type StepOptionPoA = {
  country?: string
  documentTypes: {
    bank_building_society_statement?: boolean
    utility_bill?: boolean
    council_tax?: boolean // GBR only
    benefit_letters?: boolean // GBR only
    government_letter?: boolean // non-GBR only
  }
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
