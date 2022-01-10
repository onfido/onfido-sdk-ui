const STEP_WELCOME = 'welcome'
const STEP_USER_CONSENT = 'userConsent'
const STEP_DOCUMENT = 'document'
const STEP_POA = 'poa'
const STEP_FACE = 'face'
const STEP_COMPLETE = 'complete'
const STEP_AUTH = 'auth'
const STEP_CROSS_DEVICE_SESSION_INTRO = 'crossDeviceSessionIntro'

export type StepTypes =
  | typeof STEP_WELCOME
  | typeof STEP_USER_CONSENT
  | typeof STEP_DOCUMENT
  | typeof STEP_POA
  | typeof STEP_FACE
  | typeof STEP_COMPLETE
  | typeof STEP_AUTH
  | typeof STEP_CROSS_DEVICE_SESSION_INTRO

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
      country: string | null
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

export type StepOptionAuth = { retries?: number }

export type StepOptionDocument = {
  documentTypes?: Partial<Record<DocumentTypes, DocumentTypeConfig>>
  forceCrossDevice?: boolean
  photoCaptureFallback?: never // for cross-compatibility with StepOptionFace in withCrossDeviceWhenNoCamera
  showCountrySelection?: boolean
  useLiveDocumentCapture?: boolean
  useMultiFrameCapture?: boolean
} & CaptureOptions

export type StepOptionPoA = {
  country?: string
  documentTypes?: Partial<Record<PoaTypes, boolean>>
}

export type StepOptionFace = {
  forceCrossDevice?: never // for cross-compatibility with StepOptionDocument in withCrossDeviceWhenNoCamera
  photoCaptureFallback?: boolean
  useMultipleSelfieCapture?: boolean
} & CaptureOptions

export type StepOptionComplete = {
  message?: string
  submessage?: string
}

type StepOptionsMap = {
  welcome: StepOptionWelcome
  userConsent: never
  auth: StepOptionAuth
  crossDeviceSessionIntro: never
  document: StepOptionDocument
  poa: StepOptionPoA
  face: StepOptionFace
  complete: StepOptionComplete
}

export type StepConfigMap = {
  [Type in StepTypes]: {
    type: Type
    options?: StepOptionsMap[Type]
  }
}

export type StepConfigWelcome = StepConfigMap['welcome']
export type StepConfigUserConsent = StepConfigMap['userConsent']
export type StepConfigAuth = StepConfigMap['auth']
export type StepConfigCrossDeviceSessionIntro = StepConfigMap['crossDeviceSessionIntro']
export type StepConfigDocument = StepConfigMap['document']
export type StepConfigPoa = StepConfigMap['poa']
export type StepConfigFace = StepConfigMap['face']
export type StepConfigComplete = StepConfigMap['complete']

export type StepConfig =
  | StepConfigWelcome
  | StepConfigUserConsent
  | StepConfigDocument
  | StepConfigPoa
  | StepConfigFace
  | StepConfigComplete
  | StepConfigAuth
  | StepConfigCrossDeviceSessionIntro
