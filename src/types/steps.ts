export type StepTypes = 'welcome' | 'document' | 'poa' | 'face' | 'complete'

export interface StepOptionWelcome {
  title?: string
  descriptions?: string[]
  nextButton?: string
}

export interface StepOptionDocument {
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

export interface StepOptionPoA {
  country?: string
  documentTypes: {
    bank_building_society_statement?: boolean
    utility_bill?: boolean
    council_tax?: boolean // GBR only
    benefit_letters?: boolean // GBR only
    government_letter?: boolean // non-GBR only
  }
}

export interface StepOptionFace {
  requestedVariant?: 'standard' | 'video'
  uploadFallback?: boolean
  useMultipleSelfieCapture?: boolean
}

export interface StepOptionComplete {
  message?: string
  submessage?: string
}

export interface StepConfig {
  type: StepTypes
  options?:
    | StepOptionWelcome
    | StepOptionDocument
    | StepOptionPoA
    | StepOptionFace
    | StepOptionComplete
}

export interface SdkConfig {
  // Callbacks
  onComplete?: (data: Response) => void
  onError?: (error: Error) => void
  onModalRequestClose?: () => void

  // Customization
  token: string
  useModal?: boolean
  isModalOpen?: boolean
  shouldCloseOnOverlayClick?: boolean
  containerId?: string
  containerEl?: HTMLElement | null
  language?: SupportedLanguages | LocaleConfig
  smsNumberCountryCode?: string
  userDetails?: {
    smsNumber?: string
  }
  steps?: Array<StepTypes | StepConfig>
}

export interface SdkHandle {
  setOptions(opts: SdkConfig): void
  tearDown(): void
}
