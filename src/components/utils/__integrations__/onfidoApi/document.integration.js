import fs from 'fs'
import { uploadDocument } from '../../onfidoApi'
import {
  getTestJwtToken,
  createEmptyFile,
  checkForExpectedFileUploadProperties,
  COMMON_FILE_UPLOAD_PROPERTIES,
} from '../helpers'
import { API_URL, PATH_TO_RESOURCE_FILES } from '../helpers/testUrls'
import {
  EXPIRED_JWT_TOKEN,
  EXPECTED_EXPIRED_TOKEN_ERROR,
} from '../helpers/mockExpiredJwt'

let jwtToken = null

const TEST_DOCUMENT_DATA = {
  sdkMetadata: {},
  validations: {
    detect_document: 'error',
    detect_cutoff: 'warn',
    detect_glare: 'warn',
    detect_blur: 'warn',
  },
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
    jest.setTimeout(15000)
    jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
  })

  test('uploadDocument returns expected response on successful upload', (done) => {
    const testFileName = 'passport.jpg'
    const testFileType = 'jpg'
    const expectedProperties = [
      'applicant_id',
      'sdk_warnings',
      { side: 'front' },
      { type: 'passport' },
      { issuing_country: null },
      { file_name: testFileName },
      { file_type: testFileType },
      ...COMMON_FILE_UPLOAD_PROPERTIES,
    ]
    expect.assertions(expectedProperties.length)
    const onSuccessCallback = (response) => {
      try {
        checkForExpectedFileUploadProperties(expectedProperties, response)
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
