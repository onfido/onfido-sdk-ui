import {
  DocumentImageResponse,
  FaceVideoResponse,
  UploadFileResponse,
} from './api'

export type EnterpriseCobranding = {
  text: string
}

export type EnterpriseCallbackResponse = {
  continueWithOnfidoSubmission?: boolean
  onfidoSuccess?: DocumentImageResponse | UploadFileResponse | FaceVideoResponse
}

export type EnterpriseFeatures = {
  hideOnfidoLogo?: boolean
  cobrand?: EnterpriseCobranding
  decouple?: boolean
  onSubmitDocument?: (
    data: FormData,
    token: string
  ) => Promise<EnterpriseCallbackResponse>
  onSubmitSelfie?: (
    data: FormData,
    token: string
  ) => Promise<EnterpriseCallbackResponse>
  onSubmitVideo?: (
    data: FormData,
    token: string
  ) => Promise<EnterpriseCallbackResponse>
}
