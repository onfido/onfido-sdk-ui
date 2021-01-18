import * as constants from './constants'
import type {
  CaptureMethods,
  DocumentSides,
  FaceCaptureVariants,
  SdkMetadata,
} from '~types/commons'
import type { DocumentTypes, PoaTypes } from '~types/steps'

type CaptureMetadata = {
  type?: DocumentTypes | PoaTypes
  side?: DocumentSides
  variant?: FaceCaptureVariants
}

type MetadataState = {
  metadata: CaptureMetadata & { id: string }
}

export type CapturePayload = {
  base64?: string
  blob: Blob
  filename?: string
  id?: string
  method?: CaptureMethods
  sdkMetadata: SdkMetadata
  side?: DocumentSides
}

export type DocumentCapture = {
  documentType: DocumentTypes | PoaTypes
  id: string
  isPreviewCropped?: boolean
} & CapturePayload

export type FaceCapture = {
  snapshot?: {
    blob: Blob
    filename: string
  }
  variant: FaceCaptureVariants
  id: string
} & CapturePayload

export type DeleteCapturePayload = {
  method: CaptureMethods
  side?: DocumentSides
}

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
      payload: DeleteCapturePayload
    }
  | {
      type: typeof constants.SET_CAPTURE_METADATA
      payload: MetadataPayload
    }
  | { type: typeof constants.RESET_STORE }

export type CaptureState = {
  document_front?: DocumentCapture & MetadataState
  document_back?: DocumentCapture & MetadataState
  face?: FaceCapture & MetadataState
}

export type CaptureKeys = keyof CaptureState
