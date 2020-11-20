export type ServerRegions = 'US' | 'EU' | 'CA'

export interface DocumentResponse {
  id: string
  side: string
  type: string
}

export interface FaceResponse {
  id: string
  variant: string
}

export interface SdkResponse {
  document_front: DocumentResponse
  document_back?: DocumentResponse
  face: FaceResponse
}

export interface SdkError {
  type: 'exception' | 'expired_token'
  message: string
}
