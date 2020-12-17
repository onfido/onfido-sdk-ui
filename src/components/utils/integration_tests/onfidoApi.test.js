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

const testSdkMetadata = {
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
}

const docValidations = {
  detect_document: 'error',
  detect_cutoff: 'warn',
  detect_glare: 'warn',
  detect_blur: 'warn',
}

beforeEach(async () => {
  jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
})

describe('API uploadDocument endpoint', () => {
  test('uploadDocument returns expected response on successful upload', () => {
    expect.hasAssertions()
    const onSuccessCallback = (response) => {
      console.log('* uploadDocument response:', response)
      expect(response).toHaveProperty('applicant_id')
      expect(response).toHaveProperty('created_at')
      expect(response).toHaveProperty('download_href')
      expect(response).toHaveProperty('href')
      expect(response).toHaveProperty('file_name')
      expect(response).toHaveProperty('file_size')
      expect(response).toHaveProperty('file_type')
      expect(response).toHaveProperty('id')
      expect(response).toHaveProperty('sdk_warnings')
      expect(response).toHaveProperty('image_quality')
      expect(response).toHaveProperty('side', 'front')
      expect(response).toHaveProperty('type', 'passport')
      expect(response).toHaveProperty('issuing_country', null)
    }
    fs.readFile(
      `${__dirname}/./../../../../test/resources/passport.jpg`,
      async (err, data) => {
        if (err) throw err
        const testFile = new File(data, 'passport.jpg')
        const documentData = {
          file: testFile,
          sdkMetadata: { ...testSdkMetadata },
          validations: { ...docValidations },
          side: 'front',
          type: 'passport',
        }
        await uploadDocument(
          documentData,
          API_URL,
          jwtToken,
          onSuccessCallback,
          (error) => {
            console.error(error)
          }
        )
      }
    )
  })

  test('uploadDocument returns an error on uploading an empty file', () => {
    expect.hasAssertions()
    const onErrorCallback = (error) => {
      console.log('* uploadDocument error:', error)
      expect(error.status).toBe(422)
      expect(error.response.error.type).toBe('validation_error')
      return error
    }
    const testFile = new File([], 'empty-file.jpg', {
      type: 'image/jpeg',
    })
    const documentData = {
      file: testFile,
      sdkMetadata: {},
      validations: { ...docValidations },
      side: 'front',
      type: 'passport',
    }
    uploadDocument(
      documentData,
      API_URL,
      jwtToken,
      (response) => console.warn('Unexpected API response:', response),
      (error) => onErrorCallback(error)
    )
  })

  test('uploadDocument returns an error if request is made with an expired JWT token', () => {
    expect.hasAssertions()
    const onErrorCallback = (error) => {
      expect(error.error).toMatchObject(EXPECTED_EXPIRED_TOKEN_ERROR)
    }
    fs.readFile(
      `${__dirname}/./../../../../test/resources/passport.jpg`,
      (err, data) => {
        if (err) throw err
        const testFile = new File(data, 'passport.jpg')
        const documentData = {
          file: testFile,
          sdkMetadata: { ...testSdkMetadata },
          validations: { ...docValidations },
          side: 'front',
          type: 'passport',
        }
        uploadDocument(
          documentData,
          API_URL,
          EXPIRED_JWT_TOKEN,
          (response) => console.warn('Unexpected API response:', response),
          onErrorCallback
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
