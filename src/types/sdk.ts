import type { SupportedLanguages, LocaleConfig } from './locales'
import type { StepConfig, StepTypes } from './steps'
import type { EnterpriseFeatures } from './enterprise'
import type { UICustomizationOptions } from './ui-customisation-options'

type DocumentResponse = {
  id: string
  side: string
  type: string
}

type FaceResponse = {
  id: string
  variant: string
}

export type SdkResponse = {
  document_front: DocumentResponse
  document_back?: DocumentResponse
  face: FaceResponse
}

export type SdkError = {
  type: 'exception' | 'expired_token'
  message: string
}

export type UserExitCode = 'USER_CONSENT_DENIED'

export type ServerRegions = 'US' | 'EU' | 'CA'

interface FunctionalConfigurations {
  disableAnalytics?: boolean
  mobileFlow?: boolean
  roomId?: string
  tearDown?: boolean
  useMemoryHistory?: boolean
}

export interface SdkOptions extends FunctionalConfigurations {
  // Callbacks
  onComplete?: (data: SdkResponse) => void
  onError?: (error: SdkError) => void
  onUserExit?: (data: UserExitCode) => void
  onModalRequestClose?: () => void

  // SDK Configuration
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
  enterpriseFeatures?: EnterpriseFeatures
  customUI?: UICustomizationOptions | null
}

export type SdkHandle = {
  containerId?: string
  options: SdkOptions
  setOptions(options: SdkOptions): void
  tearDown(): void
}

export type SdkInitMethod = (options: SdkOptions) => SdkHandle
