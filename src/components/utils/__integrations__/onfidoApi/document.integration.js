import fs from 'fs'
import { uploadDocument, uploadBinaryMedia } from '../../onfidoApi'
import {
  getTestJwtToken,
  createEmptyFile,
  checkForExpectedFileUploadProperties,
  COMMON_FILE_UPLOAD_PROPERTIES,
} from '../helpers'
import { API_URL, PATH_TO_RESOURCE_FILES } from '../helpers/testUrls'
import {
  EXPIRED_JWT_TOKEN,
  ASSERT_EXPIRED_JWT_ERROR,
} from '../helpers/mockExpiredJwtAndResponse'

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

describe('API uploadDocument endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
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
      (e) => ASSERT_EXPIRED_JWT_ERROR(done, e)
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

describe('API uploadBinaryMedia endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
  })

  test('uploadBinaryMedia returns expected response on successful upload', async () => {
    const testFileName = 'passport.jpg'
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testFile = new File([data], testFileName, {
      type: 'image/jpeg',
    })

    const documentData = {
      file: testFile,
      filename: testFileName,
      sdkMetadata: {},
    }

    expect.assertions(2)

    const res = await uploadBinaryMedia(documentData, API_URL, jwtToken)
    expect(res).toHaveProperty('error', null)
    expect(res).toHaveProperty('media_id')
  })

  test('uploadBinaryMedia returns 422 on empty file upload', async () => {
    const documentData = {
      file: createEmptyFile(),
      filename: 'fileName.jpg',
      sdkMetadata: {},
    }

    expect.assertions(1)

    await uploadBinaryMedia(documentData, API_URL, jwtToken).catch((res) => {
      expect(res).toHaveProperty('status', 422)
    })
  })
})
