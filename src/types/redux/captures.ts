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

export type CapturePayload = {
  method: CaptureMethods
  side?: DocumentSides
}

export type DocumentCapture = {
  blob: Blob
  sdkMetadata: SdkMetadata
  documentType: DocumentTypes | PoaTypes
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
