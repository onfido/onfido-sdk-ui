import fs from 'fs'
import {
  requestChallenges,
  uploadFaceVideo,
  uploadDocumentVideoMedia,
  uploadActiveVideo,
} from '../../onfidoApi'
import {
  checkForExpectedFileUploadProperties,
  COMMON_FILE_UPLOAD_PROPERTIES,
  getTestJwtToken,
} from '../helpers'
import { API_URL, PATH_TO_RESOURCE_FILES } from '../helpers/testUrls'
import {
  ASSERT_EXPIRED_JWT_ERROR,
  EXPIRED_JWT_TOKEN,
} from '../helpers/mockExpiredJwtAndResponse'

let jwtToken = null

const LANGUAGE_CODE = 'en'
const TEST_VIDEO_DATA = {
  challengeData: {
    challenges: [
      {
        query: [7, 8, 0],
        type: 'recite',
      },
      {
        query: 'turnRight',
        type: 'movement',
      },
    ],
    id: 'test-challenge-data',
    switchSeconds: 2021,
  },
  language: LANGUAGE_CODE,
  sdkMetadata: {},
}

describe('API uploadFaceVideo endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
  })

  test('uploadFaceVideo returns expected response on successful upload', (done) => {
    const testFileName = 'test-video.webm'
    const testFileType = 'video/webm'
    const expectedProperties = [
      { file_name: 'blob' },
      { file_type: testFileType },
      { challenge: TEST_VIDEO_DATA.challengeData.challenges },
      { languages: [{ source: 'sdk', language_code: LANGUAGE_CODE }] },
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
    const testFile = new Blob([data], {
      type: 'video/webm',
    })
    const videoData = {
      ...TEST_VIDEO_DATA,
      blob: testFile,
    }
    uploadFaceVideo(
      videoData,
      API_URL,
      jwtToken,
      (response) => onSuccessCallback(response),
      (error) => done(error)
    )
  })

  test('uploadFaceVideo returns an error if request is made with an expired JWT token', (done) => {
    expect.hasAssertions()
    const testFileName = 'test-video.webm'
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testFile = new File([data], testFileName, {
      type: 'video/webm',
    })
    const videoData = {
      blob: testFile,
      ...TEST_VIDEO_DATA,
    }
    uploadFaceVideo(
      videoData,
      API_URL,
      EXPIRED_JWT_TOKEN,
      () => done(),
      (e) => ASSERT_EXPIRED_JWT_ERROR(done, e)
    )
  })

  test('uploadFaceVideo returns an error on uploading an empty file', (done) => {
    expect.assertions(3)
    const onErrorCallback = (error) => {
      try {
        expect(error.status).toBe(422)
        expect(error.response.error.type).toBe('validation_error')
        expect(error.response.error.fields).toHaveProperty('attachment')
        done()
      } catch (err) {
        done(err)
      }
    }
    const emptyVideoBlob = new Blob([], { type: 'video/webm' })
    const videoData = {
      blob: emptyVideoBlob,
      ...TEST_VIDEO_DATA,
    }
    uploadFaceVideo(
      videoData,
      API_URL,
      jwtToken,
      (response) => done(response),
      onErrorCallback
    )
  })
})

describe('API uploadDocumentVideoMedia endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
  })

  test('uploadDocumentVideoMedia returns empty response on success', (done) => {
    process.env.SDK_SOURCE = 'onfido_web_sdk'
    process.env.SDK_VERSION = '8.3.0'

    const testFileName = 'test-video.webm'
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testFile = new Blob([data], {
      type: 'video/webm',
    })

    const videoData = {
      file: testFile,
      document_id: '12345678-1234-1234-1234-123456789abc',
      sdkMetadata: {},
    }

    const onSuccessCallback = (response) => {
      try {
        expect(response).toStrictEqual(' ')
        done()
      } catch (err) {
        done(err)
      }
    }

    expect.assertions(1)

    uploadDocumentVideoMedia(
      videoData,
      API_URL,
      jwtToken,
      (response) => onSuccessCallback(response),
      (error) => done(error)
    )
  })
})

describe('API uploadActiveVideo endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
  })

  test('uploadActiveVideo returns expected response on successful upload', (done) => {
    const testFileName = 'test-video.webm'
    const contentType = 'video/webm'
    const data = fs.readFileSync(`${PATH_TO_RESOURCE_FILES}${testFileName}`)
    const testFile = new Blob([data], {
      type: 'video/webm',
    })

    const metadata = {
      sdk_metadata: 'sdk_metadata_here',
      sdk_source: 'onfido_web_sdk',
      sdk_version: '8.3.0',
    }

    const expectedProperties = [
      'media.data.applicant_uuid',
      { 'media.data.content_type': contentType },
      { 'media.data.media_type': 'liveness' },
      { 'media.data.metadata': metadata },
    ]

    const onSuccessCallback = (response) => {
      try {
        checkForExpectedFileUploadProperties(expectedProperties, response)
        done()
      } catch (err) {
        done(err)
      }
    }

    expect.assertions(expectedProperties.length)

    uploadActiveVideo(
      testFile,
      JSON.stringify(metadata),
      API_URL,
      jwtToken,
      (response) => onSuccessCallback(response),
      (error) => done(error)
    )
  })
})

describe('API requestChallenges endpoint', () => {
  beforeEach(async () => {
    jwtToken = await getTestJwtToken()
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

    requestChallenges(
      API_URL,
      EXPIRED_JWT_TOKEN,
      (response) => response,
      (e) => ASSERT_EXPIRED_JWT_ERROR(done, e)
    )
  })
})
