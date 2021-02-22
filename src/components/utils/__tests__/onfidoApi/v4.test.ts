import { uploadBinaryMedia } from '../../onfidoApi'
import createMockXHR from '~jest/createMockXHR'

const url = 'https://test.url.com'
const jwtToken = 'fake.token'

const documentCapture = {
  file: new Blob(),
  filename: 'applicant_selfie.jpg',
  sdkMetadata: {},
}

const mockedOnSuccess = jest.fn()
const mockedOnError = jest.fn()

const runAllPromises = () => new Promise(setImmediate)

describe('onfidoApi', () => {
  describe('uploadBinaryMedia', () => {
    let mockXHR: XMLHttpRequest = null

    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })

    describe('with valid data', () => {
      beforeEach(() => {
        mockXHR = createMockXHR({ response: { media_id: 'fake-media-id' } })
        jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => mockXHR)
      })

      it('sends correct request', async () => {
        uploadBinaryMedia(
          documentCapture,
          url,
          jwtToken,
          mockedOnSuccess,
          mockedOnError
        )
        mockXHR.onload(null)
        await runAllPromises()

        expect(mockXHR.open).toHaveBeenCalledWith(
          'POST',
          `${url}/v4/binary_media`
        )
        expect(mockXHR.send).toHaveBeenCalledTimes(1)

        expect(mockedOnSuccess).toHaveBeenCalledWith({
          media_id: 'fake-media-id',
        })
        expect(mockedOnError).not.toHaveBeenCalled()
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
        uploadBinaryMedia(
          documentCapture,
          url,
          jwtToken,
          mockedOnSuccess,
          mockedOnError
        )
        mockXHR.onload(null)
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
        uploadBinaryMedia(
          { ...documentCapture, file: {} as Blob },
          url,
          jwtToken,
          mockedOnSuccess,
          mockedOnError
        )

        mockXHR.onload(null)
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
