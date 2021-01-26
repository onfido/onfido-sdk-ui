export default {
  telephony: {
    v1: {
      cross_device_sms: { status: 'OK' },
    },
  },
  api: {
    v3: {
      documents: {
        cutoff: {
          error: {
            type: 'validation_error',
            message: 'There was a validation error on this request',
            fields: {
              detect_cutoff: ['cutoff document detected in image'],
            },
          },
        },
        driving_licence_front: {
          id: '35e2f9cb-b79a-460a-ae86-297af0dace7b',
          created_at: '2020-11-26T16:32:31Z',
          file_name: 'uk_driving_licence.png',
          file_type: 'png',
          file_size: 2174203,
          type: 'council_tax',
          side: 'front',
          issuing_country: 'GBR',
          sdk_warnings: {
            detect_glare: { valid: true },
            image_quality: {
              quality: 'good',
              breakdown: {
                blur: {
                  has_blur: false,
                  max: 1,
                  min: 0,
                  score: 0.979493498802185,
                  threshold: 0.2012,
                },
                cutoff: {
                  has_cutoff: false,
                  max: 1,
                  min: 0,
                  score: 0.0234375,
                  threshold: 0.015,
                },
                has_document: true,
              },
              image_quality_uuid: '8a73d4a8-9e05-4c95-a339-b539d39194ac',
            },
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3/documents/35e2f9cb-b79a-460a-ae86-297af0dace7b',
          download_href:
            '/v3/documents/35e2f9cb-b79a-460a-ae86-297af0dace7b/download',
        },
        driving_licence_back: {
          id: '8bf3b39b-2a0e-4755-bb40-72da002d259d',
          created_at: '2020-11-26T16:35:13Z',
          file_name: 'back_driving_licence.jpg',
          file_type: 'jpg',
          file_size: 138117,
          type: 'driving_licence',
          side: 'front',
          issuing_country: 'GBR',
          sdk_warnings: {
            detect_glare: { valid: true },
            image_quality: {
              quality: 'good',
              breakdown: {
                blur: {
                  has_blur: false,
                  max: 1,
                  min: 0,
                  score: 0.575742542743683,
                  threshold: 0.2012,
                },
                cutoff: {
                  has_cutoff: false,
                  max: 1,
                  min: 0,
                  score: 0.0375,
                  threshold: 0.015,
                },
                has_document: true,
              },
              image_quality_uuid: '295f666f-f62c-4154-bb05-8ab186dcce9d',
            },
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3/documents/8bf3b39b-2a0e-4755-bb40-72da002d259d',
          download_href:
            '/v3/documents/8bf3b39b-2a0e-4755-bb40-72da002d259d/download',
        },
        glare: {
          id: 'ef848773-a7a9-4758-91cf-bc1cb280f693',
          created_at: '2020-11-26T14:59:45Z',
          file_name: 'identity_card_with_glare.jpg',
          file_type: 'jpg',
          file_size: 752301,
          type: 'passport',
          side: 'front',
          issuing_country: null,
          sdk_warnings: {
            detect_glare: { valid: false },
            detect_cutoff: { valid: true },
            detect_blur: { valid: true },
            image_quality: {
              quality: 'good',
              breakdown: {
                blur: {
                  has_blur: false,
                  max: 1,
                  min: 0,
                  score: 0.593565225601196,
                  threshold: 0.2012,
                },
                cutoff: {
                  has_cutoff: false,
                  max: 1,
                  min: 0,
                  score: 0.0286458333333333,
                  threshold: 0.015,
                },
                has_document: true,
              },
              image_quality_uuid: '3e1e2a0e-2ebb-4243-8dbd-af55005afcd2',
            },
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3/documents/ef848773-a7a9-4758-91cf-bc1cb280f693',
          download_href:
            '/v3/documents/ef848773-a7a9-4758-91cf-bc1cb280f693/download',
        },
        id_card: {
          id: 'a2910652-2ed9-42d9-82b5-0e0578ab57fb',
          created_at: '2020-11-26T16:09:12Z',
          file_name: 'national_identity_card.jpg',
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
              image_quality_uuid: 'ce43a552-c2af-4634-9939-ab7a2def39a7',
            },
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3/documents/a2910652-2ed9-42d9-82b5-0e0578ab57fb',
          download_href:
            '/v3/documents/a2910652-2ed9-42d9-82b5-0e0578ab57fb/download',
        },
        no_doc: {
          error: {
            type: 'validation_error',
            message: 'There was a validation error on this request',
            fields: { document_detection: ['no document in image'] },
          },
        },
        passport: {
          id: '155c23b4-67cc-451b-900b-069e939b84f4',
          created_at: '2020-11-26T16:17:30Z',
          file_name: 'passport.jpg',
          file_type: 'jpg',
          file_size: 327310,
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
                  score: 0.585895717144012,
                  threshold: 0.2012,
                },
                cutoff: {
                  has_cutoff: false,
                  max: 1,
                  min: 0,
                  score: 0.0520833333333333,
                  threshold: 0.015,
                },
                has_document: true,
              },
              image_quality_uuid: '084b7bc9-17d7-4a6f-b9d2-1abb8a9c35c2',
            },
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3/documents/155c23b4-67cc-451b-900b-069e939b84f4',
          download_href:
            '/v3/documents/155c23b4-67cc-451b-900b-069e939b84f4/download',
        },
      },
      live_photos: {
        face: {
          id: '6905c9d3-980d-40e6-8c48-1c4d50c10813',
          created_at: '2020-11-26T16:28:58Z',
          file_name: 'face.jpeg',
          file_type: 'image/jpeg',
          file_size: 7223,
          href: '/v3/live_photos/6905c9d3-980d-40e6-8c48-1c4d50c10813',
          download_href:
            '/v3/live_photos/6905c9d3-980d-40e6-8c48-1c4d50c10813/download',
        },
        unsupported: {
          error: {
            type: 'validation_error',
            message: 'There was a validation error on this request',
            fields: {
              attachment_content_type: ['is invalid'],
              attachment: ['is invalid'],
            },
          },
        },
      },
      live_video_challenge: {
        data: {
          challenge: [
            { query: 'turnLeft', type: 'movement' },
            { query: [7, 1, 3], type: 'recite' },
          ],
          id: '1krxhoBYDNtdmxpZxDkaV6uOKUb',
        },
      },
      live_videos: {
        id: '3837dac4-3fc5-4256-ad37-e374957c00cd',
        challenge: [
          { query: [7, 1, 3], type: 'recite' },
          { query: 'turnLeft', type: 'movement' },
        ],
        languages: [{ source: 'sdk', language_code: 'en_US' }],
        created_at: '2020-11-26T16:51:17Z',
        file_name: 'blob',
        file_type: 'video/webm',
        file_size: 154006,
        href: '/v3/live_videos/3837dac4-3fc5-4256-ad37-e374957c00cd',
        download_href:
          '/v3/live_videos/3837dac4-3fc5-4256-ad37-e374957c00cd/download',
      },
      snapshots: {
        uuid: '422e1061-a479-4356-b64a-78d53b4ea217',
      },
    },
  },
}
