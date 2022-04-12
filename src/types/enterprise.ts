import {
  DocumentImageResponse,
  FaceVideoResponse,
  UploadFileResponse,
} from './api'

export type EnterpriseCobranding = {
  text: string
}

export type EnterpriseLogoCobranding = {
  lightLogoSrc: string
  darkLogoSrc: string
}

export type EnterpriseCallbackResponse = {
  continueWithOnfidoSubmission?: boolean
  onfidoSuccessResponse?:
    | DocumentImageResponse
    | UploadFileResponse
    | FaceVideoResponse
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
