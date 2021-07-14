import { sendMultiframeSelfie } from '../../onfidoApi'
import createMockXHR from '~jest/createMockXHR'

const url = 'https://test.url.com'
const jwtToken = 'fake.token'

const snapshotData = {
  blob: new Blob(),
  filename: 'applicant_selfie.jpg',
}

const selfieData = {
  blob: new Blob(),
  filename: 'applicant_selfie.jpg',
  sdkMetadata: {},
}

const mockedOnSuccess = jest.fn()
const mockedOnError = jest.fn()
const mockedTrackingCallback = jest.fn()

const runAllPromises = () => new Promise(setImmediate)

describe('onfidoApi', () => {
  describe('sendMultiframeSelfie', () => {
    let mockXHR: XMLHttpRequest

    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })

    describe('with valid data', () => {
      beforeEach(() => {
        mockXHR = createMockXHR({ response: { payload: 'success' } })
        jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => mockXHR)
      })

      it('should send two XHR requests', async () => {
        sendMultiframeSelfie(
          snapshotData,
          selfieData,
          jwtToken,
          url,
          mockedOnSuccess,
          mockedOnError,
          mockedTrackingCallback
        )

        mockXHR &&
          mockXHR.onload &&
          mockXHR.onload(new ProgressEvent('upload snapshots')) // Upload snapshots
        await runAllPromises()

        expect(mockedTrackingCallback).toHaveBeenCalledWith(
          'Starting snapshot upload'
        )
        expect(mockXHR.open).toHaveBeenCalledWith('POST', `${url}/v3/snapshots`)
        expect(mockXHR.send).toHaveBeenCalled()

        mockXHR &&
          mockXHR.onload &&
          mockXHR.onload(new ProgressEvent('upload live photo')) // Upload live photo
        await runAllPromises()

        expect(mockXHR.open).toHaveBeenCalledWith(
          'POST',
          `${url}/v3/live_photos`
        )
        expect(mockXHR.send).toHaveBeenCalledTimes(2)
        expect(mockedOnSuccess).toHaveBeenCalledWith({ payload: 'success' })
        expect(mockedOnError).not.toHaveBeenCalled()

        expect(mockedTrackingCallback).toHaveBeenCalledWith(
          'Snapshot upload completed'
        )
        expect(mockedTrackingCallback).toHaveBeenCalledWith(
          'Starting live photo upload'
        )
      })
    })

    describe('with request error', () => {
      beforeEach(() => {
        mockXHR = createMockXHR({
          status: 401,
          response: { error: 'unauthorized' },
        })
        jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => mockXHR)
      })

      it('should call onError callback', async () => {
        sendMultiframeSelfie(
          snapshotData,
          selfieData,
          jwtToken,
          url,
          mockedOnSuccess,
          mockedOnError,
          mockedTrackingCallback
        )

        mockXHR && mockXHR.onload && mockXHR.onload(new ProgressEvent('error'))
        await runAllPromises()

        expect(mockXHR.send).toHaveBeenCalledTimes(1)
        expect(mockedOnSuccess).not.toHaveBeenCalled()
        expect(mockedOnError).toHaveBeenCalledWith({
          status: 401,
          response: { error: 'unauthorized' },
        })
      })
    })

    describe('with invalid data', () => {
      beforeEach(() => {
        mockXHR = createMockXHR({})
        jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => mockXHR)
      })

      it('should call onError callback with TypeError', async () => {
        const invalidSnapshotData = { ...snapshotData, blob: {} as Blob }
        const invalidSelfieData = { ...selfieData, blob: {} as Blob }

        sendMultiframeSelfie(
          invalidSnapshotData,
          invalidSelfieData,
          jwtToken,
          url,
          mockedOnSuccess,
          mockedOnError,
          mockedTrackingCallback
        )

        mockXHR &&
          mockXHR.onload &&
          mockXHR.onload(new ProgressEvent('Type error'))
        await runAllPromises()

        expect(mockXHR.send).not.toHaveBeenCalled()
        expect(mockedOnSuccess).not.toHaveBeenCalled()
        expect(mockedOnError).toHaveBeenCalledTimes(1)

        const error = mockedOnError.mock.calls[0][0]
        expect(error).toMatchObject(/TypeError/)
        expect(error.message).toEqual(
          `Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'.`
        )
      })
    })
  })
})
