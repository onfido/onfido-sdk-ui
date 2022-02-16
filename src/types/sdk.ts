import type { SupportedLanguages, LocaleConfig } from './locales'
import type { RequestedVariant, StepConfig, StepTypes } from './steps'
import type { EnterpriseFeatures } from './enterprise'
import type { UICustomizationOptions } from './ui-customisation-options'

type DocumentResponse = {
  id: string
  side: string
  type: string
  variant: RequestedVariant
}

type DocumentVideoResponse = {
  id: string
  media_uuids: string[]
  variant: 'video'
}

type FaceResponse = {
  id: string
  variant: RequestedVariant
}

export type SdkResponse = {
  document_front?: DocumentResponse
  document_back?: DocumentResponse
  document_video?: DocumentVideoResponse
  face?: FaceResponse
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
  autoFocusOnInitialScreenTitle?: boolean
  crossDeviceClientIntroProductName?: string
  crossDeviceClientIntroProductLogoSrc?: string
  _crossDeviceLinkMethods?: Array<string> | null
}

export type SdkHandle = {
  containerId?: string
  options: SdkOptions
  setOptions(options: SdkOptions): void
  tearDown(): void
}

export type SdkInitMethod = (options: SdkOptions) => SdkHandle
