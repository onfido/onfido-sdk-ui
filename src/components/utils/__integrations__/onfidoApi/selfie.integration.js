import fs from 'fs'
import {
  uploadFacePhoto,
  uploadSnapshot,
  sendMultiframeSelfie,
} from '../../onfidoApi'
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

/* eslint jest/no-test-callback: 0 */
/*
 *  NOTE: This rule is disabled for these integration tests as onfidoApi.js were implemented using callbacks.
          Hence it is necessary to use Jest' done() callback function as per Jest's documentation for
          testing asynchronous code written with the callback pattern https://jestjs.io/docs/en/asynchronous
          Work to address this will be done in a separate ticket (CX-6016)
 */

describe('API uploadFacePhoto endpoint', () => {
  beforeEach(async () => {
    jest.setTimeout(15000)
    jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
  })

  test('uploadFacePhoto returns expected response on successful upload', (done) => {
    const testFileName = 'one_face.jpg'
    const testFileType = 'image/jpeg'
    const expectedProperties = [
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
    const selfieData = { file: testFile, sdkMetadata: {} }
    uploadFacePhoto(
      selfieData,
      API_URL,
      jwtToken,
      (response) => onSuccessCallback(response),
      (error) => done(error)
    )
  })

  test('uploadFacePhoto returns an error if request is made with an expired JWT token', (done) => {
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
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testFile = new File([data], testFileName, {
      type: 'image/jpeg',
    })
    const selfieData = { file: testFile, sdkMetadata: {} }
    uploadFacePhoto(
      selfieData,
      API_URL,
      EXPIRED_JWT_TOKEN,
      () => done(),
      onErrorCallback
    )
  })

  test('uploadFacePhoto returns an error on uploading an empty file', (done) => {
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
    const selfieData = { file: createEmptyFile(), sdkMetadata: {} }
    uploadFacePhoto(
      selfieData,
      API_URL,
      jwtToken,
      (response) => done(response),
      onErrorCallback
    )
  })
})

describe('API uploadSnapshot endpoint', () => {
  beforeEach(async () => {
    jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
  })

  test('uploadSnapshot returns expected response on successful upload', (done) => {
    expect.assertions(1)
    const testFileName = 'one_face.png'
    const onSuccessCallback = (response) => {
      try {
        expect(response).toHaveProperty('uuid')
        done()
      } catch (err) {
        done(err)
      }
    }
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testBlob = new Blob([data], {
      type: 'image/png',
    })
    const snapshotData = {
      file: {
        blob: testBlob,
        filename: 'applicant_snapshot.png',
      },
    }
    uploadSnapshot(
      snapshotData,
      API_URL,
      jwtToken,
      (response) => onSuccessCallback(response),
      (error) => {
        console.error(error.response.error.fields)
        done(error)
      }
    )
  })

  test('uploadSnapshot returns an error if request is made with an expired JWT token', (done) => {
    expect.hasAssertions()
    const onErrorCallback = (error) => {
      try {
        expect(error).toEqual(EXPECTED_EXPIRED_TOKEN_ERROR)
        done()
      } catch (err) {
        done(err)
      }
    }
    const testFileName = 'one_face.png'
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testBlob = new Blob([data], {
      type: 'image/png',
    })
    const snapshotData = {
      file: {
        blob: testBlob,
        filename: 'applicant_snapshot.png',
      },
    }
    uploadSnapshot(
      snapshotData,
      API_URL,
      EXPIRED_JWT_TOKEN,
      () => done(),
      onErrorCallback
    )
  })

  test('uploadSnapshot returns an error on uploading an empty file', (done) => {
    expect.assertions(3)
    const onErrorCallback = (error) => {
      try {
        expect(error.status).toBe(422)
        expect(error.response.error.type).toBe('validation_error')
        expect(error.response.error.fields).toHaveProperty('attachment', [
          `can't be blank`,
        ])
        done()
      } catch (err) {
        done(err)
      }
    }
    const emptyTestBlob = new Blob([], {
      type: 'image/png',
    })
    const snapshotData = {
      blob: emptyTestBlob,
      filename: 'applicant_snapshot.png',
    }
    uploadSnapshot(
      snapshotData,
      API_URL,
      jwtToken,
      (response) => done(response),
      onErrorCallback
    )
  })
})

// FIXME: consistently fails with 403 error, as separate test suites uploadSnapshot, uploadFacePhoto tests work
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('API sendMultiframeSelfie endpoint', () => {
  beforeEach(async () => {
    jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
  })

  test('sendMultiframeSelfie returns expected response on successful upload', (done) => {
    const testFileType = 'image/png'
    const expectedProperties = [
      { file_name: 'applicant_selfie.png' },
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
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}one_face.png`)
    const testSnapshot = new Blob([data], {
      type: testFileType,
    })
    const snapshotData = {
      blob: testSnapshot,
      filename: 'applicant_snapshot.png',
    }

    const testSelfieImage = new Blob([data], {
      type: testFileType,
    })
    const selfieData = {
      blob: testSelfieImage,
      filename: 'applicant_selfie.png',
      id: 'test-selfie',
      method: 'face',
      side: null,
      variant: 'standard',
      snapshot_uuids: ['test-snapshot-uuid'],
      sdkMetadata: {},
    }

    sendMultiframeSelfie(
      snapshotData,
      selfieData,
      API_URL,
      jwtToken,
      (response) => onSuccessCallback(response),
      (error) => {
        console.error(error.response)
        done(error)
      },
      (eventString) => console.log(eventString)
    )
  })

  test('sendMultiframeSelfie returns an error if request is made with an expired JWT token', (done) => {
    expect.hasAssertions()
    const onErrorCallback = (error) => {
      try {
        expect(error).toEqual(EXPECTED_EXPIRED_TOKEN_ERROR)
        done()
      } catch (err) {
        done(err)
      }
    }
    const testFileName = 'one_face.png'
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testSnapshot = new Blob([data], {
      type: 'image/png',
    })
    const snapshotData = {
      blob: testSnapshot,
      filename: 'applicant_snapshot.png',
    }

    const testSelfieImage = new Blob([data], {
      type: 'image/png',
    })
    const selfieData = {
      blob: testSelfieImage,
      filename: 'applicant_selfie.png',
      id: 'test-selfie',
      method: 'face',
      side: null,
      variant: 'standard',
      sdkMetadata: {},
    }

    sendMultiframeSelfie(
      snapshotData,
      selfieData,
      API_URL,
      EXPIRED_JWT_TOKEN,
      () => done(),
      onErrorCallback,
      (eventString) => console.log(eventString)
    )
  })

  test('sendMultiframeSelfie returns an error on uploading empty files', (done) => {
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

    const testSnapshot = new Blob([], {
      type: 'image/png',
    })
    const snapshotData = {
      blob: testSnapshot,
      filename: 'applicant_snapshot.png',
    }

    const testSelfieImage = new Blob([], {
      type: 'image/png',
    })
    const selfieData = {
      blob: testSelfieImage,
      filename: 'applicant_selfie.png',
      id: 'test-selfie',
      method: 'face',
      side: null,
      variant: 'standard',
      sdkMetadata: {},
    }

    sendMultiframeSelfie(
      snapshotData,
      selfieData,
      API_URL,
      jwtToken,
      (response) => done(response),
      onErrorCallback,
      (eventString) => console.log(eventString)
    )
  })
})
