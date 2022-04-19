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
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3.3/documents/35e2f9cb-b79a-460a-ae86-297af0dace7b',
          download_href:
            '/v3.3/documents/35e2f9cb-b79a-460a-ae86-297af0dace7b/download',
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
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3.3/documents/8bf3b39b-2a0e-4755-bb40-72da002d259d',
          download_href:
            '/v3.3/documents/8bf3b39b-2a0e-4755-bb40-72da002d259d/download',
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
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3.3/documents/ef848773-a7a9-4758-91cf-bc1cb280f693',
          download_href:
            '/v3.3/documents/ef848773-a7a9-4758-91cf-bc1cb280f693/download',
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
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3.3/documents/a2910652-2ed9-42d9-82b5-0e0578ab57fb',
          download_href:
            '/v3.3/documents/a2910652-2ed9-42d9-82b5-0e0578ab57fb/download',
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
          },
          applicant_id: '<to-be-replaced>',
          href: '/v3.3/documents/155c23b4-67cc-451b-900b-069e939b84f4',
          download_href:
            '/v3.3/documents/155c23b4-67cc-451b-900b-069e939b84f4/download',
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
        no_face: {
          error: {
            type: 'face_detection',
            message: 'There was a validation error on this request',
            fields: {
              face_detection: ['no_face'],
            },
          },
        },
        multiple_face: {
          error: {
            type: 'face_detection',
            message: 'There was a validation error on this request',
            fields: {
              face_detection: ['Multiple faces'],
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
      poa_countries: [
        {
          country_alpha3: 'GBR',
          country_alpha2: 'GB',
          country: 'United Kingdom of Great Britain and Northern Ireland',
          document_types: [
            'bank_building_society_statement',
            'utility_bill',
            'council_tax',
            'benefit_letters',
          ],
        },
        {
          country_alpha3: 'DEU',
          country_alpha2: 'DE',
          country: 'Germany',
          document_types: ['bank_building_society_statement', 'utility_bill'],
        },
      ],
      validate_document: {
        breakdown: {
          document_confidence: 0.00010868642129935324,
          document_detected: false,
        },
        id: 'ru18be',
        is_document: false,
        valid: false,
      },
      sdk_configurations: {
        biometrics_liveness: {
          active: {
            enabled: false,
            video_settings: {
              bitrate: 5000000,
              codec: 'H264',
              codec_profile: 30,
              duration: 15000,
              exposure_lock: true,
              focus_lock: true,
              framerate: 25,
              white_balance_lock: true,
            },
          },
          passive: {
            enabled: false,
            video_settings: {
              bitrate: 8000000,
              codec: 'H264',
              duration: 8000,
              exposure_lock: true,
              focus_lock: true,
              framerate: 25,
              white_balance_lock: true,
            },
          },
        },
        document_capture: {
          torch_turn_on_time_ms: -1,
          video_bitrate: 5000000,
          video_length_ms: 1500,
        },
        experimental_features: {
          enable_image_quality_service: false,
          enable_multi_frame_capture: false,
        },
        sdk_features: {
          enable_on_device_face_detection: true,
          enable_require_applicant_consents: false,
        },
        validations: {
          on_device: {
            blur: {
              applies_to: [{ doc_type: 'ALL' }],
              max_total_retries: 2,
              threshold: 150,
            },
          },
        },
      },
      applicant_consents: [
        {
          name: 'privacy_notices_read_consent_given',
          granted: false,
          required: true,
        },
      ],
    },
    v4: {
      binary_media: {
        image: {
          media_id: 'd2b07639-625b-4aa8-bab0-9d7ec6c5cfd9',
          error: null,
        },
        video: {
          media_id: '2bcb03dc-d026-42da-9d7e-2443cdb9fc79',
          error: null,
        },
      },
      documents: {
        uuid: 'de79e389-0061-4b0e-974a-77b5f5a06153',
        applicant_uuid: '89d6bbfa-6084-46c4-b116-291899eed8e8',
        document_media: [
          {
            binary_media: {
              uuid: 'd2b07639-625b-4aa8-bab0-9d7ec6c5cfd9',
              content_type: 'image/png',
              byte_size: 2615959,
            },
            document_fields: [],
          },
          {
            binary_media: {
              uuid: '2bcb03dc-d026-42da-9d7e-2443cdb9fc79',
              content_type: 'video/webm',
              byte_size: 9875579,
            },
            document_fields: [],
          },
        ],
        document_type: 'IDENTITY_DOCUMENT',
      },
    },
  },
}
