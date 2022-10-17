import { EventEmitter2 } from 'eventemitter2'
import { EnterpriseFeatures } from './enterprise'
import { SupportedLanguages, LocaleConfig } from './locales'
import {
  DocumentTypes,
  PoaTypes,
  PrivateStepConfig,
  StepConfig,
  StepTypes,
} from './steps'
import { SdkOptions } from './sdk'
import { UICustomizationOptions } from './ui-customisation-options'

export interface NormalisedSdkOptions extends Omit<SdkOptions, 'steps'> {
  steps: StepConfig[]
}

export interface SDKOptionsWithRenderData extends NormalisedSdkOptions {
  containerId: string | 'onfido-mount'
  containerEl: HTMLElement
}

export type NarrowSdkOptions = Omit<
  NormalisedSdkOptions,
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
  | ({ type: typeof STEP_CROSS_DEVICE; options?: never } & PrivateStepConfig)

export type CaptureMethods =
  | 'poa'
  | 'document'
  | 'face'
  | 'auth'
  | 'data'
  | 'activeVideo'

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
  camera_settings?: {
    aspect_ratio?: number
    frame_rate?: number
    height?: number
    width?: number
  }
  take_number?: number
}

export type CountryData = {
  country_alpha2: string
  country_alpha3: string
  name: string
}

export type UrlsConfig = {
  onfido_api_url?: string
  telephony_url?: string
  hosted_sdk_url?: string
  cross_device_url?: string
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
  | 'DOC_VIDEO_TIMEOUT'
  | 'EXPIRED_TOKEN'
  | 'EXPIRED_TRIAL'
  | 'FACE_VIDEO_TIMEOUT'
  | 'PROFILE_DATA_TIMEOUT'
  | 'FORBIDDEN_CLIENT_ERROR'
  | 'GEOBLOCKED_ERROR'
  | 'GENERIC_CLIENT_ERROR'
  | 'GLARE_DETECTED'
  | 'INTERRUPTED_FLOW_ERROR'
  | 'DOCUMENT_DETECTION'
  | 'INVALID_SIZE'
  | 'INVALID_TYPE'
  | 'INVALID_IMAGE_SIZE'
  | 'MULTIPLE_FACES_ERROR'
  | 'NO_FACE_ERROR'
  | 'REQUEST_ERROR'
  | 'SMS_FAILED'
  | 'SMS_OVERUSE'
  | 'UNSUPPORTED_ANDROID_BROWSER'
  | 'UNSUPPORTED_FILE'
  | 'UNSUPPORTED_IOS_BROWSER'

export type ErrorTypes = 'error' | 'warning'

export type documentSelectionType = {
  config: unknown
  document_type: string
  id: string
  issuing_country: string
}

export type MobileConfig = {
  stepIndex: number
  deviceHasCameraSupport?: boolean
  disableAnalytics?: boolean
  disableAnalyticsCookies?: boolean
  useWorkflow?: boolean
  documentType?: DocumentTypes
  enterpriseFeatures?: EnterpriseFeatures
  idDocumentIssuingCountry?: CountryData
  poaDocumentCountry?: CountryData
  language?: SupportedLanguages | LocaleConfig
  poaDocumentType?: PoaTypes
  steps: StepConfig[]
  token?: string
  urls: UrlsConfig
  anonymousUuid?: string
  customUI: UICustomizationOptions | null
  crossDeviceClientIntroProductName?: string
  crossDeviceClientIntroProductLogoSrc?: string
  analyticsSessionUuid?: string
  workflowRunId?: string
}

export type FormattedError = {
  type: 'expired_token' | 'expired_trial' | 'exception'
  message: string
}
