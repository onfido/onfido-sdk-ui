import fs from 'fs'
import { uploadDocument } from '../onfidoApi'
import { getTestJwtToken, createEmptyFile } from './helpers'
import { API_URL, PATH_TO_RESOURCE_FILES } from './testUrls'

let jwtToken = null

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

const TEST_DOCUMENT_DATA = {
  sdkMetadata: {},
  validations: { ...DOCUMENT_VALIDATIONS },
  side: 'front',
  type: 'passport',
}

/* eslint jest/no-test-callback: 0 */
/*
 *  NOTE: This rule is disabled for these integration tests as onfidoApi.js were implemented using callbacks.
          Hence it is necessary to use Jest' done() callback function as per Jest's documentation for
          testing asynchronous code written with the callback pattern https://jestjs.io/docs/en/asynchronous
          Work to address this will be done in a separate ticket (CX-6016)
 */

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
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testFile = new File([data], testFileName, {
      type: 'image/jpeg',
    })
    const documentData = {
      file: testFile,
      ...TEST_DOCUMENT_DATA,
    }
    uploadDocument(
      documentData,
      API_URL,
      jwtToken,
      (response) => onSuccessCallback(response),
      (error) => done(error)
    )
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
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testFile = new File([data], testFileName, {
      type: 'image/jpeg',
    })
    const documentData = {
      file: testFile,
      ...TEST_DOCUMENT_DATA,
    }
    uploadDocument(
      documentData,
      API_URL,
      EXPIRED_JWT_TOKEN,
      () => done(),
      onErrorCallback
    )
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
      ...TEST_DOCUMENT_DATA,
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
