import {
  DocumentImageResponse,
  FaceVideoResponse,
  UploadFileResponse,
} from './api'

export type EnterpriseCobranding = {
  text: string
}

export type EnterpriseLogoCobranding = {
  src: string
}

export type EnterpriseCallbackResponse = {
  continueWithOnfidoSubmission?: boolean
  onfidoSuccess?: DocumentImageResponse | UploadFileResponse | FaceVideoResponse
}

export type EnterpriseFeatures = {
  hideOnfidoLogo?: boolean
  cobrand?: EnterpriseCobranding
  logoCobrand?: EnterpriseLogoCobranding
  useCustomizedApiRequests?: boolean
  onSubmitDocument?: (data: FormData) => Promise<EnterpriseCallbackResponse>
  onSubmitSelfie?: (data: FormData) => Promise<EnterpriseCallbackResponse>
  onSubmitVideo?: (data: FormData) => Promise<EnterpriseCallbackResponse>
}
