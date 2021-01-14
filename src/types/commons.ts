export type CaptureMethods = 'document' | 'face'

export type CaptureMethodVariants = 'live' | 'html5'

export type DeviceTypes = 'desktop' | 'mobile'

export type DocumentSides = 'front' | 'back'

export type FaceCaptureVariants = 'standard' | 'live'

type ImageInfo = {
  width: number
  height: number
  fileSize: number
}

type ImageResizeInfo = {
  resizedFrom: ImageInfo
  resizedTo: ImageInfo
}

export type SdkMetadata = {
  captureMethod: CaptureMethodVariants
  imageResizeInfo?: ImageResizeInfo
  isCrossDeviceFlow: boolean
  deviceType: DeviceTypes
  system: {
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
