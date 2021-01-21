import { StepConfig } from './steps'
import { SdkOptions } from './sdk'

export interface NormalisedSdkOptions extends SdkOptions {
  steps?: StepConfig[]
}

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
