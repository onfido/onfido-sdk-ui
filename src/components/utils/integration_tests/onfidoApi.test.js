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
let jwtToken = null
const getTestJwtToken = (resolve) => {
  const tokenFactoryUrl = 'https://token-factory.onfido.com/sdk_token' // EU region
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

const DOCUMENT_VALIDATIONS = {
  detect_document: 'error',
  detect_cutoff: 'warn',
  detect_glare: 'warn',
  detect_blur: 'warn',
}

const PATH_TO_TEST_FILES = `${__dirname}/./../../../../test/resources/`

const createEmptyFile = (
  testFileName = 'empty_file.jpg',
  mimeType = 'image/jpeg'
) =>
  new File([], testFileName, {
    type: mimeType,
  })

/* eslint jest/no-test-callback: 0 */

describe('API uploadDocument endpoint', () => {
  beforeEach(async () => {
    jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
  })

  test('uploadDocument returns expected response on successful upload', (done) => {
    expect.assertions(12)
    const testFileName = 'passport.jpg'
    const onSuccessCallback = (response) => {
      try {
        expect(response).toHaveProperty('applicant_id')
        expect(response).toHaveProperty('created_at')
        expect(response).toHaveProperty('download_href')
        expect(response).toHaveProperty('href')
        expect(response).toHaveProperty('file_name', testFileName)
        expect(response).toHaveProperty('file_size')
        expect(response).toHaveProperty('file_type', 'jpg')
        expect(response).toHaveProperty('id')
        expect(response).toHaveProperty('sdk_warnings')
        expect(response).toHaveProperty('side', 'front')
        expect(response).toHaveProperty('type', 'passport')
        expect(response).toHaveProperty('issuing_country', null)
        done()
      } catch (err) {
        done(err)
      }
    }
    fs.readFile(`${PATH_TO_TEST_FILES}${testFileName}`, (err, data) => {
      if (err) throw new Error(err)
      const testFile = new File([data], testFileName, {
        type: 'image/jpeg',
      })
      const documentData = {
        file: testFile,
        sdkMetadata: {},
        validations: { ...DOCUMENT_VALIDATIONS },
        side: 'front',
        type: 'passport',
      }
      uploadDocument(
        documentData,
        API_URL,
        jwtToken,
        (response) => onSuccessCallback(response),
        (error) => done(error)
      )
    })
  })

  test('uploadDocument returns an error if request is made with an expired JWT token', (done) => {
    expect.hasAssertions()
    const onErrorCallback = (error) => {
      try {
        expect(error).toEqual(EXPECTED_EXPIRED_TOKEN_ERROR)
        done()
      } catch (err) {
        done(err)
      }
    }
    const testFileName = 'passport.jpg'
    fs.readFile(`${PATH_TO_TEST_FILES}${testFileName}`, (err, data) => {
      if (err) throw err
      const testFile = new File([data], testFileName, {
        type: 'image/jpeg',
      })
      const documentData = {
        file: testFile,
        sdkMetadata: {},
        validations: { ...DOCUMENT_VALIDATIONS },
        side: 'front',
        type: 'passport',
      }
      uploadDocument(
        documentData,
        API_URL,
        EXPIRED_JWT_TOKEN,
        () => done(),
        onErrorCallback
      )
    })
  })

  test('uploadDocument returns an error on uploading an empty file', (done) => {
    expect.assertions(3)
    const onErrorCallback = (error) => {
      try {
        expect(error.status).toBe(422)
        expect(error.response.error.type).toBe('validation_error')
        expect(error.response.error.fields).toHaveProperty('file')
        done()
      } catch (err) {
        done(err)
      }
    }
    const documentData = {
      file: createEmptyFile(),
      sdkMetadata: {},
      validations: { ...DOCUMENT_VALIDATIONS },
      side: 'front',
      type: 'passport',
    }
    uploadDocument(
      documentData,
      API_URL,
      jwtToken,
      (response) => done(response),
      onErrorCallback
    )
  })
})

describe('API uploadLivePhoto endpoint', () => {
  beforeEach(async () => {
    jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
  })

  test('uploadLivePhoto returns expected response on successful upload', (done) => {
    expect.assertions(7)
    const testFileName = 'one_face.jpg'
    const onSuccessCallback = (response) => {
      try {
        expect(response).toHaveProperty('created_at')
        expect(response).toHaveProperty('download_href')
        expect(response).toHaveProperty('href')
        expect(response).toHaveProperty('file_name', testFileName)
        expect(response).toHaveProperty('file_size')
        expect(response).toHaveProperty('file_type', 'image/jpeg')
        expect(response).toHaveProperty('id')
        done()
      } catch (err) {
        done(err)
      }
    }
    fs.readFile(`${PATH_TO_TEST_FILES}${testFileName}`, (err, data) => {
      if (err) throw new Error(err)
      const testFile = new File([data], testFileName, {
        type: 'image/jpeg',
      })
      const selfieData = { file: testFile }
      uploadLivePhoto(
        selfieData,
        API_URL,
        jwtToken,
        (response) => onSuccessCallback(response),
        (error) => done(error)
      )
    })
  })

  test('uploadLivePhoto returns an error if request is made with an expired JWT token', (done) => {
    expect.hasAssertions()
    const onErrorCallback = (error) => {
      try {
        expect(error).toEqual(EXPECTED_EXPIRED_TOKEN_ERROR)
        done()
      } catch (err) {
        done(err)
      }
    }
    const testFileName = 'one_face.jpg'
    fs.readFile(`${PATH_TO_TEST_FILES}${testFileName}`, (err, data) => {
      if (err) throw err
      const testFile = new File([data], testFileName, {
        type: 'image/jpeg',
      })
      const selfieData = { file: testFile }
      uploadLivePhoto(
        selfieData,
        API_URL,
        EXPIRED_JWT_TOKEN,
        () => done(),
        onErrorCallback
      )
    })
  })

  test('uploadLivePhoto returns an error on uploading an empty file', (done) => {
    expect.assertions(3)
    const onErrorCallback = (error) => {
      try {
        expect(error.status).toBe(422)
        expect(error.response.error.type).toBe('validation_error')
        expect(error.response.error.fields).toHaveProperty(
          'attachment_file_size'
        )
        done()
      } catch (err) {
        done(err)
      }
    }
    const selfieData = { file: createEmptyFile() }
    uploadLivePhoto(
      selfieData,
      API_URL,
      jwtToken,
      (response) => done(response),
      onErrorCallback
    )
  })
})

describe('API requestChallenges endpoint', () => {
  beforeEach(async () => {
    jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
  })

  test('requestChallenges returns a random 3-digit number challenge and a face turn challenge', async () => {
    expect.assertions(2)
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

  test('requestChallenges returns an error if request is made with an expired JWT token', (done) => {
    expect.hasAssertions()
    const onErrorCallback = (error) => {
      try {
        expect(error).toEqual(EXPECTED_EXPIRED_TOKEN_ERROR)
        done()
      } catch (err) {
        done(err)
      }
    }
    requestChallenges(
      API_URL,
      EXPIRED_JWT_TOKEN,
      (response) => response,
      onErrorCallback
    )
  })
})
