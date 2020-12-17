import {
  uploadDocument,
  uploadLivePhoto,
  uploadSnapshot,
  sendMultiframeSelfie,
  requestChallenges,
  uploadLiveVideo,
} from '../onfidoApi'
import fs from 'fs'

const API_URL = 'https://api.onfido.com'
const EXPIRED_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MDc3MDc1NTEsInBheWxvYWQiOiJycUFvMEtSbXdtWlViWFRLUHp2TXlTaGZtelNDNVhtRWM3aVZ4ZzJ5b2NQbEQrbk9rQmxtcHBaK0FCKzBcbkwveEtYRm4yeTBNZGxNNXRXVE5HeVNVSG5nPT1cbiIsInV1aWQiOiJpd29rRlZlZEcxOCIsImVudGVycHJpc2VfZmVhdHVyZXMiOnsiY29icmFuZCI6dHJ1ZSwiaGlkZU9uZmlkb0xvZ28iOnRydWV9LCJ1cmxzIjp7InRlbGVwaG9ueV91cmwiOiJodHRwczovL3RlbGVwaG9ueS5vbmZpZG8uY29tIiwiZGV0ZWN0X2RvY3VtZW50X3VybCI6Imh0dHBzOi8vc2RrLm9uZmlkby5jb20iLCJzeW5jX3VybCI6Imh0dHBzOi8vc3luYy5vbmZpZG8uY29tIiwiYXV0aF91cmwiOiJodHRwczovL2VkZ2UuYXBpLm9uZmlkby5jb20iLCJvbmZpZG9fYXBpX3VybCI6Imh0dHBzOi8vYXBpLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8veGQub25maWRvLmNvbSJ9fQ.Ece4NQpZLsPzsgd6W4kDYNugW66W_Fl__jfz6d96WEI'
const EXPECTED_EXPIRED_TOKEN_ERROR = {
  status: 401,
  response: {
    error: {
      fields: {},
      message: 'The token has expired, please request a new one',
      type: 'expired_token',
    },
  },
}

let jwtToken = null
const getTestJwtToken = (resolve) => {
  const tokenFactoryUrl = 'https://token-factory.onfido.com/sdk_token'
  const request = new XMLHttpRequest()
  request.open('GET', tokenFactoryUrl, true)
  request.setRequestHeader(
    'Authorization',
    `BASIC ${process.env.SDK_TOKEN_FACTORY_SECRET}`
  )
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      const data = JSON.parse(request.responseText)
      return resolve(data.message)
    }
  }
  request.send()
}

beforeEach(async () => {
  jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
})

describe('API uploadDocument endpoint', () => {
  // TODO happy path, failure scenarios
  test('uploadDocument returns expected response on successful upload', () => {
    const onSuccessCallback = (response) => {
      console.log('* uploadDocument response:', response)
      console.log('* uploadDocument expectedApiResponse:', expectedApiResponse)
      const expectedApiResponse = {
        applicant_id: 'f31503c7-7764-42b3-a11a-596121ee8492',
        created_at: '2020-12-15T15:31:21Z', // Date ISO string
        download_href:
          '/v3/documents/0fa0b9ac-df61-4d30-bb0d-9637cece2a0d/download',
        file_name: 'mock-document.jpg',
        file_size: 50000,
        file_type: 'jpg',
        href: '/v3/documents/0fa0b9ac-df61-4d30-bb0d-9637cece2a0d',
        id: '0fa0b9ac-df61-4d30-bb0d-9637cece2a0d',
        issuing_country: null,
        sdk_warnings: {
          detect_blur: { valid: true },
          detect_cutoff: { valid: true },
          detect_glare: { valid: true },
        },
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
            document: {
              detection_score: 0.999860764,
              has_document: true,
              max: 1,
              min: 0,
              threshold: 0.9887919909,
            },
          },
          image_quality_uuid: 'b56cc15c-4cc2-4aa3-b191-3193c3c7900b',
        },
        side: 'front',
        type: 'passport',
      }
      expect(response).toMatchObject(expectedApiResponse) // should fail!
    }
    fs.readFile(
      `${__dirname}/./../../../../test/resources/passport.jpg`,
      (err, data) => {
        if (err) throw err
        const testFile = new File(data, 'passport.jpg')
        const documentData = {
          file: testFile,
          sdkMetadata: {
            captureMethod: 'html5',
            deviceType: 'desktop',
            imageResizeInfo: null,
            isCrossDeviceFlow: false,
            system: {
              os: 'Macintosh',
              os_version: '10.15.7',
              browser: 'Chrome',
              browser_version: '87.0.4280.88',
            },
          },
          validations: {
            detect_document: 'error',
            detect_cutoff: 'warn',
            detect_glare: 'warn',
            detect_blur: 'warn',
          },
          side: 'front',
          type: 'passport',
        }
        uploadDocument(
          documentData,
          API_URL,
          jwtToken,
          onSuccessCallback,
          (error) => {
            console.error(error)
            throw new Error(error)
          }
        )
      }
    )
  })
})

describe('API requestChallenges endpoint', () => {
  test('requestChallenges returns a random 3-digit number challenge and a face turn challenge', async () => {
    expect.hasAssertions()
    const onSuccessCallback = (response, resolve) => {
      const { challenge } = response.data
      expect(challenge).toHaveLength(2)
      // Example challenge response (order of challenge types is random):
      // [{"query": "turnLeft", "type": "movement"}, {"query": [1, 9, 0], "type": "recite"}]
      const expectedTypeRegex = /(movement|recite)/
      expect(challenge).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: expect.stringMatching(expectedTypeRegex),
            query: expect.anything(),
          }),
          expect.objectContaining({
            type: expect.stringMatching(expectedTypeRegex),
            query: expect.anything(),
          }),
        ])
      )
      resolve()
    }
    await new Promise((resolve, reject) =>
      requestChallenges(
        API_URL,
        jwtToken,
        (response) => onSuccessCallback(response, resolve),
        (error) => reject(error)
      )
    )
  })

  test('requestChallenges returns an error if request is made with an expired JWT token', () => {
    expect.hasAssertions()
    const onErrorCallback = (error, reject) => {
      console.log('requestChallenges Error:', error)
      expect(error.error).toEqual(EXPECTED_EXPIRED_TOKEN_ERROR)
      reject()
    }
    requestChallenges(
      API_URL,
      EXPIRED_JWT_TOKEN,
      (response) => response,
      onErrorCallback
    )
  })
})
