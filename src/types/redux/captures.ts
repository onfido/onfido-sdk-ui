import * as constants from './constants'

import type { ChallengeData } from '~types/api'
import type {
  CaptureMethods,
  DocumentSides,
  FilePayload,
  SdkMetadata,
} from '~types/commons'
import type { DocumentTypes, PoaTypes, RequestedVariant } from '~types/steps'

export type CaptureMetadata = {
  id?: string
  type?: DocumentTypes | PoaTypes
  side?: DocumentSides
  variant?: RequestedVariant
}

type MetadataState = {
  metadata: CaptureMetadata
}

export type CapturePayload = {
  base64?: string
  blob: Blob
  challengeData?: ChallengeData
  filename?: string
  id?: string
  isPreviewCropped?: boolean
  method?: CaptureMethods
  sdkMetadata: SdkMetadata
  variant?: RequestedVariant
}

export type DocumentCapture = {
  documentType: DocumentTypes | PoaTypes
  id: string
  isPreviewCropped?: boolean
  side?: DocumentSides
} & CapturePayload

export type FaceCapture = {
  id: string
  side: never
  snapshot?: FilePayload
} & CapturePayload

export type DeleteCapturePayload = {
  method: CaptureMethods
  side?: DocumentSides
  variant?: RequestedVariant
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
  document_video?: DocumentCapture & MetadataState
  face?: FaceCapture & MetadataState
}

export type CaptureKeys = keyof CaptureState
