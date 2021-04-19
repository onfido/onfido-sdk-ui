import { sendMultiframeSelfie, objectToFormData } from '../onfidoApi'
import { noop } from '../func'

const jwtToken = 'my_token'

const snapshotData = {
  blob: new Blob(),
  filename: 'applicant_selfie.jpg',
}

const selfieData = {
  blob: new Blob(),
  filename: 'applicant_selfie.jpg',
  sdkMetadata: {},
}

const url = 'https://test.url.com'

const createMockXHR = () => ({
  open: jest.fn(),
  onload: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  status: 201,
  response: JSON.stringify({ payload: 'success' }),
})

const oldXMLHttpRequest = window.XMLHttpRequest
let mockXHR = null

beforeEach(() => {
  mockXHR = createMockXHR()
  window.XMLHttpRequest = jest.fn(() => mockXHR)
})

afterEach(() => {
  window.XMLHttpRequest = oldXMLHttpRequest
})

const onSuccess = (res) => {
  expect(res).toMatchObject({ payload: 'success' })
}
const onError = (res) => {
  expect(res).toMatchObject({
    status: 401,
    response: { error: 'unauthorized' },
  })
}

// mock tracking callback
const trackingCallback = (message) => noop(message)

describe('objectToFormData', () => {
  it('should generate Form Data with all values contained in a given a payload object with varying value types', async () => {
    const testVideoBlob = new Blob([], { type: 'video/webm' })
    const testChallengeString = JSON.stringify([
      { query: 'turnRight', type: 'movement' },
      { query: [7, 5, 8], type: 'recite' },
    ])
    const testChallengeId = 'test-id-123'
    const testChallengeSwitchAt = 1096
    const testLanguagesString = JSON.stringify([
      { source: 'sdk', language_code: 'en' },
    ])
    const result = objectToFormData({
      file: testVideoBlob,
      challenge: testChallengeString,
      challenge_id: testChallengeId,
      challenge_switch_at: testChallengeSwitchAt,
      languages: testLanguagesString,
    })

    // challenge_switch_at is a numerical value in the payload passed to objectToFormData() but
    // FormData.append() automatically converts the sent value to String if it is not a String or Blob
    const expectedChallengeSwitchAt = testChallengeSwitchAt.toString(10)

    expect(result.get('file')).toMatchObject(testVideoBlob)
    expect(result.get('challenge')).toEqual(testChallengeString)
    expect(result.get('challenge_id')).toEqual(testChallengeId)
    expect(result.get('challenge_switch_at')).toEqual(expectedChallengeSwitchAt)
    expect(result.get('languages')).toEqual(testLanguagesString)
  })
})

describe('sendMultiframeSelfie', () => {
  describe('with valid data', () => {
    it('should send two XHR requests', async () => {
      sendMultiframeSelfie(
        snapshotData,
        selfieData,
        jwtToken,
        url,
        onSuccess,
        onError,
        trackingCallback
      )
      mockXHR.onload() // First XHR has been mocked
      await Promise.resolve()
      mockXHR.onload() // Second XHR has been mocked
      expect.assertions(2) // There are two assertion in this test case because onSuccess is calling `expect` too
      expect(mockXHR.send.mock.calls.length).toBe(2) // Two request send() methods have been called
    })
  })

  describe('with request error', () => {
    it('should call onError callback', () => {
      expect.assertions(2) // There are two assertion in this test case because onError is calling `expect` too
      sendMultiframeSelfie(
        snapshotData,
        selfieData,
        jwtToken,
        url,
        onSuccess,
        onError,
        trackingCallback
      )
      mockXHR.status = 401
      mockXHR.response = JSON.stringify({ error: 'unauthorized' })
      mockXHR.onload()
      expect(mockXHR.send.mock.calls.length).toBe(1)
    })
  })

  describe('with invalid data', () => {
    const invalidSnapshotData = { ...snapshotData, blob: {} }
    const invalidSelfieData = { ...selfieData, blob: {} }
    const onError = (res) => {
      expect(res).toMatchObject(/TypeError/)
      expect(res.message).toEqual(
        `Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'.`
      )
    }
    it('should call onError callback with TypeError', () => {
      expect.assertions(2)
      sendMultiframeSelfie(
        invalidSnapshotData,
        invalidSelfieData,
        jwtToken,
        url,
        onSuccess,
        onError,
        trackingCallback
      )
    })
  })
})
