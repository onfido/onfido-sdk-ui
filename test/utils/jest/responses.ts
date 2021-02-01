import { DocumentVideoResponse, DocumentImageResponse } from '~types/api'

export const fakePassportImageResponse: DocumentImageResponse = {
  id: '00000000-0000-0000-0000-000000000000',
  created_at: '2020-01-01T00:00:00Z',
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
    image_quality: {
      quality: 'good',
      breakdown: {
        blur: {
          has_blur: false,
          max: 1,
          min: 0,
          score: 0.91948390007019,
          threshold: 0.2012,
        },
        cutoff: {
          has_cutoff: false,
          max: 1,
          min: 0,
          score: 0.0546875,
          threshold: 0.015,
        },
        has_document: true,
      },
      image_quality_uuid: '00000000-0000-0000-0000-000000000000',
    },
  },
  applicant_id: '00000000-0000-0000-0000-000000000000',
  href: '/v3/documents/00000000-0000-0000-0000-000000000000',
  download_href: '/v3/documents/00000000-0000-0000-0000-000000000000/download',
}

export const fakePassportVideoResponse: DocumentVideoResponse = {
  id: '00000000-0000-0000-0000-000000000000',
  created_at: '2020-01-01T00:00:00Z',
  file_name: 'passport.jpg',
  file_type: 'jpg',
  file_size: 73591,
  type: 'passport',
  issuing_country: null,
  applicant_id: '00000000-0000-0000-0000-000000000000',
  href: '/v3/documents/00000000-0000-0000-0000-000000000000',
  download_href: '/v3/documents/00000000-0000-0000-0000-000000000000/download',
}
