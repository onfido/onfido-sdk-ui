import {
  DocumentImageResponse,
  FaceVideoResponse,
  UploadFileResponse,
} from './api'

export type EnterpriseCobranding = {
  text: string
}

type EnterpriseCallbackResponse = {
  continueWithOnfidoSubmission?: boolean
}

type EnterpriseCallbackDocumentResponse = {
  onfidoResponse?: DocumentImageResponse
} & EnterpriseCallbackResponse

type EnterpriseCallbackSelfieResponse = {
  onfidoResponse?: UploadFileResponse
} & EnterpriseCallbackResponse

type EnterpriseCallbackVideoResponse = {
  onfidoResponse?: FaceVideoResponse
} & EnterpriseCallbackResponse

export type EnterpriseFeatures = {
  hideOnfidoLogo?: boolean
  cobrand?: EnterpriseCobranding
  useSubmitCallbacks?: boolean
  onSubmitDocument?: (
    data: FormData,
    token: string
  ) => Promise<EnterpriseCallbackDocumentResponse>
  onSubmitSelfie?: (
    data: FormData,
    token: string
  ) => Promise<EnterpriseCallbackSelfieResponse>
  onSubmitVideo?: (
    data: FormData,
    token: string
  ) => Promise<EnterpriseCallbackVideoResponse>
}
