import { sendMultiframeSelfie } from '../onfidoApi'
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
    const onError = (res) => expect(res).toMatchObject(/TypeError/)
    it('should call onError callback with TypeError', () => {
      expect.assertions(1)
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
