import * as constants from './constants'

import type { ChallengeData } from '~types/api'
import type {
  CaptureMethods,
  DocumentSides,
  FilePayload,
  SdkMetadata,
} from '~types/commons'
import type {
  DocumentTypes,
  PoaTypes,
  RequestedVariant,
  StepOptionData,
} from '~types/steps'

export type CaptureMetadata = {
  id?: string
  type?: DocumentTypes | PoaTypes
  side?: DocumentSides
  variant?: RequestedVariant
}

export type MetadataState = {
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
  side?: never
  snapshot?: FilePayload
} & CapturePayload

export type DataCapture = StepOptionData & CapturePayload

export type ActiveVideoCapture = {
  id: string
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
      payload: DocumentCapture | FaceCapture | ActiveVideoCapture
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
  poa?: DocumentCapture & MetadataState
  face?: FaceCapture & MetadataState
  data?: DataCapture & MetadataState
  active_video?: ActiveVideoCapture & MetadataState
  // Timestamps of all the images taken within the current session
  takesHistory: {
    document_front: string[]
    document_back: string[]
    document_video: string[]
    face: string[]
    data: string[]
    poa: string[]
    active_video: string[]

    // Fields for backwards-compatible with other capture state
    id?: never
    metadata?: never
  }
}

export type CaptureKeys = Exclude<keyof CaptureState, 'takesHistory'>
