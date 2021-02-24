import fs from 'fs'
import { requestChallenges, uploadFaceVideo } from '../../onfidoApi'
import {
  getTestJwtToken,
  checkForExpectedFileUploadProperties,
  COMMON_FILE_UPLOAD_PROPERTIES,
} from '../helpers'
import { API_URL, PATH_TO_RESOURCE_FILES } from '../helpers/testUrls'
import {
  EXPIRED_JWT_TOKEN,
  EXPECTED_EXPIRED_TOKEN_ERROR,
} from '../helpers/mockExpiredJwt'

let jwtToken = null

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
  language: 'en_US',
  sdkMetadata: {},
}

/* eslint jest/no-test-callback: 0 */
/*
 *  NOTE: This rule is disabled for these integration tests as onfidoApi.js were implemented using callbacks.
          Hence it is necessary to use Jest' done() callback function as per Jest's documentation for
          testing asynchronous code written with the callback pattern https://jestjs.io/docs/en/asynchronous
          Work to address this will be done in a separate ticket (CX-6016)
 */

describe('API uploadFaceVideo endpoint', () => {
  beforeEach(async () => {
    jest.setTimeout(10000)
    jwtToken = await new Promise((resolve) => getTestJwtToken(resolve))
  })

  test('uploadFaceVideo returns expected response on successful upload', (done) => {
    const testFileName = 'test-video.webm'
    const testFileType = 'video/webm'
    const expectedProperties = [
      { file_name: 'blob' },
      { file_type: testFileType },
      { challenge: TEST_VIDEO_DATA.challengeData.challenges },
      { languages: [{ source: 'sdk', language_code: 'en_US' }] },
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
    const onErrorCallback = (error) => {
      try {
        expect(error).toEqual(EXPECTED_EXPIRED_TOKEN_ERROR)
        done()
      } catch (err) {
        done(err)
      }
    }
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
      onErrorCallback
    )
  })

  test('uploadFaceVideo returns an error on uploading an empty file', (done) => {
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
