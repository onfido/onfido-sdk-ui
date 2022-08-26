const STEP_WELCOME = 'welcome'
const STEP_USER_CONSENT = 'userConsent'
const STEP_DOCUMENT = 'document'
const STEP_POA = 'poa'
const STEP_FACE = 'face'
const STEP_COMPLETE = 'complete'
const STEP_AUTH = 'auth'
const STEP_ACTIVE_VIDEO = 'activeVideo'
const STEP_CROSS_DEVICE_SESSION_INTRO = 'crossDeviceSessionIntro'
const STEP_DATA_CAPTURE = 'data'
const STEP_WORKFLOW_RETRY = 'retry'

export type PublicStepTypes =
  | typeof STEP_WELCOME
  | typeof STEP_DOCUMENT
  | typeof STEP_POA
  | typeof STEP_FACE
  | typeof STEP_COMPLETE
  | typeof STEP_AUTH
  | typeof STEP_CROSS_DEVICE_SESSION_INTRO
  | typeof STEP_DATA_CAPTURE

export type PrivateStepTypes =
  | typeof STEP_WORKFLOW_RETRY
  | typeof STEP_USER_CONSENT
  | typeof STEP_ACTIVE_VIDEO

export type StepTypes = PublicStepTypes | PrivateStepTypes

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

export type DocumentTypeConfig = boolean | CountryConfig

export type CountryConfig = {
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

export type StepOptionRetry = {
  text?: {
    headline?: string
    description?: string
    button_title?: string
  }
}

export type StepOptionAuth = { retries?: number }

export type StepOptionDocument = {
  documentTypes?: Partial<Record<DocumentTypes, DocumentTypeConfig>>
  forceCrossDevice?: boolean
  photoCaptureFallback?: never // for cross-compatibility with StepOptionFace in withCrossDeviceWhenNoCamera
  useLiveDocumentCapture?: boolean
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

export type OptionsEnbaled =
  | 'address_enabled'
  | 'country_residence_enabled'
  | 'dob_enabled'
  | 'email_enabled'
  | 'first_name_enabled'
  | 'last_name_enabled'
  | 'phone_number_enabled'
  | 'nationality_enabled'
  | 'pan_enabled'
  | 'ssn_enabled'

export type StepOptionData = {
  first_name?: string
  last_name?: string
  email?: string
  dob?: string
  country_residence?: string
  phone_number?: string
  address?: {
    country?: string
    line1?: string
    line2?: string
    line3?: string
    town?: string
    state?: string
    postcode?: string
  }
  ssn_enabled?: boolean
  profile_data_selection?: {
    address_enabled?: boolean
    country_residence_enabled?: boolean
    dob_enabled?: boolean
    email_enabled?: boolean
    first_name_enabled?: boolean
    last_name_enabled?: boolean
    phone_number_enabled?: boolean
    nationality_enabled?: boolean
    pan_enabled?: boolean
    ssn_enabled?: boolean
  }
  getPersonalData: GetPersonalDataFunc
}

export type FlatStepOptionData = Omit<StepOptionData, 'address'> &
  StepOptionData['address']

export type GetDocDataFunc = () => Array<{ id: string }>
export type GetPersonalDataFunc = () => Record<string, unknown>

type StepOptionsMap = {
  welcome: StepOptionWelcome
  userConsent: never
  auth: StepOptionAuth
  crossDeviceSessionIntro: never
  document: StepOptionDocument
  poa: StepOptionPoA
  face: StepOptionFace
  activeVideo: never
  complete: StepOptionComplete
  data: StepOptionData
  retry: StepOptionRetry
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
export type StepConfigActiveVideo = StepConfigMap['activeVideo']
export type StepConfigCrossDeviceSessionIntro = StepConfigMap['crossDeviceSessionIntro']
export type StepConfigDocument = StepConfigMap['document']
export type StepConfigPoa = StepConfigMap['poa']
export type StepConfigFace = StepConfigMap['face']
export type StepConfigComplete = StepConfigMap['complete']
export type StepConfigData = StepConfigMap['data']
export type StepConfigRetry = StepConfigMap['retry']

export type PublicStepConfig =
  | StepConfigWelcome
  | StepConfigDocument
  | StepConfigPoa
  | StepConfigFace
  | StepConfigComplete
  | StepConfigAuth
  | StepConfigActiveVideo
  | StepConfigCrossDeviceSessionIntro
  | StepConfigData
  | StepConfigRetry

export type PrivateStepConfig = {
  skip?: boolean
}

export type StepConfig = (PublicStepConfig | StepConfigUserConsent) &
  PrivateStepConfig
