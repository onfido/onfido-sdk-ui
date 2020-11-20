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

export interface SdkOptions {
  // Callbacks
  onComplete?: (data: SdkResponse) => void
  onError?: (error: SdkError) => void
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
  options: SdkOptions
  setOptions(opts: SdkOptions): void
  tearDown(): void
}
