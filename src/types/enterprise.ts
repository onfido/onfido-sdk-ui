import {
  ApiParsedError,
  DocumentImageResponse,
  FaceVideoResponse,
  UploadFileResponse,
} from './api'

export type EnterpriseCobranding = {
  text: string
}

type EnterpriseCallbackResponse = {
  continueWithOnfidoSubmission?: boolean
  onfidoSuccess?: DocumentImageResponse | UploadFileResponse | FaceVideoResponse
  onfidoError?: ApiParsedError
}

export type EnterpriseFeatures = {
  hideOnfidoLogo?: boolean
  cobrand?: EnterpriseCobranding
  useSubmitCallbacks?: boolean
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
