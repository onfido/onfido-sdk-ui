import { createV4Document, uploadBinaryMedia } from '../../onfidoApi'
import createMockXHR from '~jest/createMockXHR'

const url = 'https://test.url.com'
const jwtToken = 'fake.token'

const documentCapture = {
  file: new Blob(),
  filename: 'applicant_selfie.jpg',
  sdkMetadata: {},
}

const fakeDocumentResponse = {
  uuid: '272bfecf-2700-4f81-9215-aab3b616c711',
  applicant_uuid: '83710329-50ed-4d6c-b9ec-942a7d2d23ca',
  document_media: [
    {
      binary_media: {
        uuid: '9fff8d87-cc71-4445-85f9-346ccc365e94',
      },
    },
    {
      binary_media: {
        uuid: '196f356d-b5ed-4350-a0a5-9a3f0695eb14',
      },
    },
  ],
  document_type: 'IDENTITY_DOCUMENT',
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

        const mockedXhrSend = jest.spyOn(mockXHR, 'send')
        expect(mockedXhrSend).toHaveBeenCalledTimes(1)
        expect(mockedXhrSend.mock.calls[0][0]).toBeInstanceOf(FormData)

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

  describe('createV4Document', () => {
    let mockXHR: XMLHttpRequest = null

    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })

    describe('with valid data', () => {
      const fakeBinaryMediaIds = ['fake-id-1', 'fake-id-2']

      beforeEach(() => {
        mockXHR = createMockXHR({ response: fakeDocumentResponse })
        jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => mockXHR)
      })

      it('sends correct request', async () => {
        createV4Document(
          fakeBinaryMediaIds,
          url,
          jwtToken,
          mockedOnSuccess,
          mockedOnError
        )
        mockXHR.onload(null)
        await runAllPromises()

        expect(mockXHR.open).toHaveBeenCalledWith('POST', `${url}/v4/documents`)

        const mockedXhrSend = jest.spyOn(mockXHR, 'send')
        expect(mockedXhrSend).toHaveBeenCalledTimes(1)
        expect(mockedXhrSend).toHaveBeenCalledWith(
          JSON.stringify({
            document_media: [
              { binary_media: { uuid: 'fake-id-1' } },
              { binary_media: { uuid: 'fake-id-2' } },
            ],
          })
        )

        expect(mockedOnSuccess).toHaveBeenCalledWith(fakeDocumentResponse)
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
        createV4Document([], url, jwtToken, mockedOnSuccess, mockedOnError)
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
  })
})
