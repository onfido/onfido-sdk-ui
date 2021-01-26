import { EventEmitter2 } from 'eventemitter2'
import { EnterpriseFeatures } from './enterprise'
import { SupportedLanguages, LocaleConfig } from './locales'
import { DocumentTypes, PoaTypes, StepConfig, StepTypes } from './steps'
import { SdkOptions } from './sdk'

export interface NormalisedSdkOptions extends SdkOptions {
  steps?: StepConfig[]
}

export type NarrowSdkOptions = Omit<
  NormalisedSdkOptions,
  | 'containerEl'
  | 'containerId'
  | 'isModalOpen'
  | 'onModalRequestClose'
  | 'shouldCloseOnOverlayClick'
  | 'useModal'
> & {
  events?: EventEmitter2.emitter
}

const STEP_CROSS_DEVICE = 'crossDevice'
export type ExtendedStepTypes = StepTypes | typeof STEP_CROSS_DEVICE
export type ExtendedStepConfig =
  | StepConfig
  | { type: typeof STEP_CROSS_DEVICE; options?: never }

export type CaptureMethods = 'document' | 'face'

export type CaptureMethodVariants = 'live' | 'html5'

export type DeviceTypes = 'desktop' | 'mobile'

export type DocumentSides = 'front' | 'back'

type ImageInfo = {
  width: number
  height: number
  fileSize?: number
}

export type ImageResizeInfo = {
  resizedFrom: ImageInfo
  resizedTo: ImageInfo
}

export type SdkMetadata = {
  captureMethod?: CaptureMethodVariants
  camera_name?: string
  microphone_name?: string
  imageResizeInfo?: ImageResizeInfo
  isCrossDeviceFlow?: boolean
  deviceType?: DeviceTypes
  system?: {
    os: string
    os_version: string
    browser: string
    browser_version: string
  }
}

export type CountryData = {
  country_alpha2?: string
  country_alpha3?: string
  name?: string
}

export type UrlsConfig = {
  onfido_api_url?: string
  telephony_url?: string
  hosted_sdk_url?: string
  detect_document_url?: string
  sync_url?: string
}

export type FilePayload = {
  blob: Blob
  filename: string
}

const FLOW_CAPTURE = 'captureSteps'
const FLOW_CROSS_DEVICE = 'crossDeviceSteps'
export type FlowVariants = typeof FLOW_CAPTURE | typeof FLOW_CROSS_DEVICE

export type ErrorNames =
  | 'BLUR_DETECTED'
  | 'CAMERA_INACTIVE'
  | 'CAMERA_INACTIVE_NO_FALLBACK'
  | 'CAMERA_NOT_WORKING'
  | 'CAMERA_NOT_WORKING_NO_FALLBACK'
  | 'CUTOFF_DETECTED'
  | 'FORBIDDEN_CLIENT_ERROR'
  | 'GENERIC_CLIENT_ERROR'
  | 'GLARE_DETECTED'
  | 'INTERRUPTED_FLOW_ERROR'
  | 'INVALID_CAPTURE'
  | 'INVALID_SIZE'
  | 'INVALID_TYPE'
  | 'MULTIPLE_FACES_ERROR'
  | 'NO_FACE_ERROR'
  | 'REQUEST_ERROR'
  | 'SMS_FAILED'
  | 'SMS_OVERUSE'
  | 'UNSUPPORTED_ANDROID_BROWSER'
  | 'UNSUPPORTED_FILE'
  | 'UNSUPPORTED_IOS_BROWSER'
  | 'VIDEO_TIMEOUT'

export type ErrorTypes = 'error' | 'warning'

export type MobileConfig = {
  clientStepIndex: number
  deviceHasCameraSupport: boolean
  disableAnalytics: boolean
  documentType: DocumentTypes
  enterpriseFeatures: EnterpriseFeatures
  idDocumentIssuingCountry: CountryData
  language: SupportedLanguages | LocaleConfig
  poaDocumentType: PoaTypes
  step: number
  steps: StepConfig[]
  token: string
  urls: UrlsConfig
  woopraCookie: string
}
