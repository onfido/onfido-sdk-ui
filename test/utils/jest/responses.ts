import {
  CreateV4DocumentResponse,
  DocumentImageResponse,
  ParsedError,
} from '~types/api'

/**
 * exp: 1614106934
 * uuid: 'oghRY_bk774'
 */
export const jwtToken =
  'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE2MTQxMDY5MzQsInBheWxvYWQiOnsiYXBwIjoiZTgwMDIzMDQtOWUzOS00MWMzLThkYTYtYTc3OWRjNjU4MWRiIiwicmVmIjoiKjovLyovKiJ9LCJ1dWlkIjoib2doUllfYms3NzQiLCJ1cmxzIjp7InRlbGVwaG9ueV91cmwiOiJodHRwczovL3RlbGVwaG9ueS5ldS13ZXN0LTEuZGV2Lm9uZmlkby54eXoiLCJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9maW5kLWRvY3VtZW50LWluLWltYWdlLmV1LXdlc3QtMS5kZXYub25maWRvLnh5eiIsInN5bmNfdXJsIjoiaHR0cHM6Ly9jcm9zcy1kZXZpY2Utc3luYy5ldS13ZXN0LTEuZGV2Lm9uZmlkby54eXoiLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQuZXUtd2VzdC0xLmRldi5vbmZpZG8ueHl6IiwiYXV0aF91cmwiOiJodHRwczovL2FwaS1nYXRld2F5LmV1LXdlc3QtMS5kZXYub25maWRvLnh5eiIsIm9uZmlkb19hcGlfdXJsIjoiaHR0cHM6Ly9hcGkuZXUtd2VzdC0xLmRldi5vbmZpZG8ueHl6In19.MIGHAkIBmsdivlJi3BuvZpR2yMLN72nWOmfYfuw4Gk_uhgT6WvNzFOs94q_bxC7MGylukLVTSrldrjcRsEQ1PFhWBbyaEPACQUBeelkbf5VAp3FOq0HNLsixFQdOLLnramFXE0ZDK29u30fnsmpxn3bb-ru7FmOAEfu5Pm712NRdvVo1jn7tpPDo'

export const fakePassportImageResponse: DocumentImageResponse = {
  id: 'a2910652-2ed9-42d9-82b5-0e0578ab57fb',
  created_at: '2020-11-26T16:09:12Z',
  file_name: 'passport.jpg',
  file_type: 'jpg',
  file_size: 73591,
  type: 'passport',
  side: 'front',
  issuing_country: null,
  sdk_warnings: {
    detect_glare: { valid: true },
    detect_cutoff: { valid: true },
    detect_blur: { valid: true },
  },
  applicant_id: '<to-be-replaced>',
  href: '/v3.3/documents/a2910652-2ed9-42d9-82b5-0e0578ab57fb',
  download_href:
    '/v3.3/documents/a2910652-2ed9-42d9-82b5-0e0578ab57fb/download',
}

export const fakeDrivingLicenceFrontResponse: DocumentImageResponse = {
  id: '35e2f9cb-b79a-460a-ae86-297af0dace7b',
  created_at: '2020-11-26T16:32:31Z',
  file_name: 'driving_licence_front.png',
  file_type: 'png',
  file_size: 2174203,
  type: 'driving_licence',
  side: 'front',
  issuing_country: 'USA',
  sdk_warnings: {
    detect_glare: { valid: true },
  },
  applicant_id: '<to-be-replaced>',
  href: '/v3.3/documents/35e2f9cb-b79a-460a-ae86-297af0dace7b',
  download_href:
    '/v3.3/documents/35e2f9cb-b79a-460a-ae86-297af0dace7b/download',
}

export const fakeDrivingLicenceBackResponse: DocumentImageResponse = {
  id: '8bf3b39b-2a0e-4755-bb40-72da002d259d',
  created_at: '2020-11-26T16:35:13Z',
  file_name: 'driving_licence_front.png',
  file_type: 'jpg',
  file_size: 138117,
  type: 'driving_licence',
  side: 'back',
  issuing_country: 'USA',
  sdk_warnings: {
    detect_glare: { valid: true },
  },
  applicant_id: '<to-be-replaced>',
  href: '/v3.3/documents/8bf3b39b-2a0e-4755-bb40-72da002d259d',
  download_href:
    '/v3.3/documents/8bf3b39b-2a0e-4755-bb40-72da002d259d/download',
}

export const fakeNoDocumentError: ParsedError = {
  response: {
    error: {
      type: 'validation_error',
      message: 'There was a validation error on this request',
      fields: { document_detection: ['no document in image'] },
    },
  },
  status: 422,
}

export const fakeUnknownError: ParsedError = {
  response: {
    error: {
      type: 'unknown',
      message: 'Unknown error',
      fields: {},
    },
  },
  status: 500,
}

// v4 APIs
export const fakeCreateV4DocumentResponse: CreateV4DocumentResponse = {
  uuid: '272bfecf-2700-4f81-9215-aab3b616c711',
  applicant_uuid: '83710329-50ed-4d6c-b9ec-942a7d2d23ca',
  document_media: [
    {
      binary_media: {
        uuid: '9fff8d87-cc71-4445-85f9-346ccc365e94',
        content_type: '',
        byte_size: 0,
      },
      document_fields: [],
    },
    {
      binary_media: {
        uuid: '196f356d-b5ed-4350-a0a5-9a3f0695eb14',
        content_type: '',
        byte_size: 0,
      },
      document_fields: [],
    },
  ],
  document_type: 'IDENTITY_DOCUMENT',
}

export const fakeAccessDeniedError: ParsedError = {
  response: {
    error: {
      type: 'ACCESS_DENIED',
      message:
        'User is not authorized to access this resource with an explicit deny',
      fields: {},
    },
  },
  status: 403,
}
