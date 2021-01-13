import * as constants from '../constants'
import type { DocumentTypes, PoATypes } from '~types/steps'

type CaptureMethods = 'document' | 'face'

type CaptureMethodVariants = 'live' | 'html5'

type DeviceTypes = 'desktop' | 'mobile'

type DocumentSides = 'front' | 'back'

type FaceCaptureVariants = 'standard' | 'live'

type ImageInfo = {
  width: number
  height: number
  fileSize: number
}

type SdkMetadata = {
  captureMethod: CaptureMethodVariants
  imageResizeInfo?: {
    resizedFrom: ImageInfo
    resizedTo: ImageInfo
  }
  isCrossDeviceFlow: boolean
  deviceType: DeviceTypes
  system: {
    os: string
    os_version: string
    browser: string
    browser_version: string
  }
}

type CaptureMetadata = {
  type?: DocumentTypes | PoATypes
  side?: DocumentSides
  variant?: FaceCaptureVariants
}

export type CapturePayload = {
  method: CaptureMethods
  side?: DocumentSides
}

export type DocumentCapture = {
  blob: Blob
  sdkMetadata: SdkMetadata
  documentType: DocumentTypes | PoATypes
  id: string
  metadata: CaptureMetadata & { id: string }
} & CapturePayload

export type FaceCapture = {
  snapshot?: Blob
  variant: FaceCaptureVariants
  id: string
  metadata: CaptureMetadata & { id: string }
} & CapturePayload

export type MetadataPayload = {
  captureId: string
  metadata: CaptureMetadata
}

export type CaptureActions =
  | {
      type: typeof constants.CAPTURE_CREATE
      payload: DocumentCapture | FaceCapture
    }
  | {
      type: typeof constants.CAPTURE_DELETE
      payload: CapturePayload
    }
  | {
      type: typeof constants.SET_CAPTURE_METADATA
      payload: MetadataPayload
    }
  | { type: typeof constants.RESET_STORE }

export type CaptureState = {
  document_front?: DocumentCapture
  document_back?: DocumentCapture
  face?: FaceCapture
}
