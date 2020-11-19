export interface DocumentResponse {
  id: string
  side: string
  type: string
}

export interface FaceResponse {
  id: string
  variant: string
}

export interface Response {
  document_front: DocumentResponse
  document_back?: DocumentResponse
  face: FaceResponse
}

export interface Error {
  type: 'exception' | 'expired_token'
  message: string
}
