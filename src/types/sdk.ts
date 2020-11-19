import { SupportedLanguages, LocaleConfig } from './locales'
import { StepConfig, StepTypes } from './steps'

export interface SdkOptions {
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
  options: SdkOptions
  setOptions(opts: SdkOptions): void
  tearDown(): void
}
