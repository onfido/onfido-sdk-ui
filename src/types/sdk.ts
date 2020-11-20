import { SupportedLanguages, LocaleConfig } from './locales'
import { StepConfig, StepTypes } from './steps'

interface DocumentResponse {
  id: string
  side: string
  type: string
}

interface FaceResponse {
  id: string
  variant: string
}

export interface SdkResponse {
  document_front: DocumentResponse
  document_back?: DocumentResponse
  face: FaceResponse
}

export interface SdkError {
  type: 'exception' | 'expired_token'
  message: string
}

export type ServerRegions = 'US' | 'EU' | 'CA'

interface UndocumentedOptions {
  disableAnalytics?: boolean
  mobileFlow?: boolean
  roomId?: string
  tearDown?: boolean
  useMemoryHistory?: boolean
}

export interface SdkOptions extends UndocumentedOptions {
  // Callbacks
  onComplete?: (data: SdkResponse) => void
  onError?: (error: SdkError) => void
  onModalRequestClose?: () => void

  // Customization
  token?: string
  useModal?: boolean
  isModalOpen?: boolean
  shouldCloseOnOverlayClick?: boolean
  containerId?: string
  containerEl?: HTMLElement | null
  language?: SupportedLanguages | LocaleConfig
  region?: ServerRegions
  smsNumberCountryCode?: string
  userDetails?: {
    smsNumber?: string
  }
  steps?: Array<StepTypes | StepConfig>
  enterpriseFeatures?: {
    hideOnfidoLogo?: boolean
    cobrand?: { text: string }
  }
}

export interface SdkHandle {
  options: SdkOptions
  setOptions(options: SdkOptions): void
  tearDown(): void
}

export interface OnfidoSdk {
  init: (options: SdkOptions) => SdkHandle
}
