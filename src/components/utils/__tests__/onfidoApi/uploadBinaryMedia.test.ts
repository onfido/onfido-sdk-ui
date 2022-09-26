import { jwtToken } from '~jest/responses'
import { uploadBinaryMedia } from '~utils/onfidoApi'
import { hmac256 } from '~utils/blob'
import { performHttpRequest } from '~core/Network'

jest.mock('~utils/blob')
jest.mock('~core/Network')

const url = 'https://test.url.com'

const documentCapture = {
  file: new Blob(),
  filename: 'applicant_selfie.jpg',
  sdkMetadata: {},
}

const mockedHmac256 = hmac256 as jest.MockedFunction<typeof hmac256>
const mockedPerformHttpReq = performHttpRequest as jest.MockedFunction<
  typeof performHttpRequest
>

describe('onfidoApi', () => {
  describe('uploadBinaryMedia', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('with valid data', () => {
      beforeEach(() => {
        mockedPerformHttpReq.mockImplementation((_params, onSuccess) =>
          onSuccess({ media_id: 'fake-media-id' })
        )
      })

      it('sends correct request', async () => {
        const response = await uploadBinaryMedia(documentCapture, url, jwtToken)
        expect(response).toEqual({ media_id: 'fake-media-id' })

        expect(mockedHmac256).not.toHaveBeenCalled()

        const [params] = mockedPerformHttpReq.mock.calls[0]
        expect(params).toMatchObject({
          endpoint: `${url}/v4/binary_media`,
          token: `Bearer ${jwtToken}`,
        })
      })

      describe('with HMAC included', () => {
        beforeEach(() => {
          Blob.prototype.arrayBuffer = jest
            .fn()
            .mockResolvedValue(new ArrayBuffer(0))

          mockedHmac256.mockResolvedValue('fake-hmac')
        })

        it('sends correct request', async () => {
          const response = await uploadBinaryMedia(
            documentCapture,
            url,
            jwtToken,
            true
          )
          expect(response).toEqual({ media_id: 'fake-media-id' })

          // hmac256() to be called with jwtToken's uuid
          expect(mockedHmac256.mock.calls[0][0]).toEqual('oghRY_bk774')

          const [params] = mockedPerformHttpReq.mock.calls[0]
          expect(params).toMatchObject({
            endpoint: `${url}/v4/binary_media`,
            headers: { 'X-Video-Auth': 'fake-hmac' },
            token: `Bearer ${jwtToken}`,
          })
        })
      })
    })

    describe('with request error', () => {
      beforeEach(() => {
        mockedPerformHttpReq.mockImplementation(
          (_params, _onSuccess, onError) =>
            onError({
              status: 401,
              response: JSON.stringify({ error: 'unauthorized' }),
            })
        )
      })

      it('should call onError callback', async () => {
        await expect(
          uploadBinaryMedia(documentCapture, url, jwtToken)
        ).rejects.toMatchObject({
          status: 401,
          response: { error: 'unauthorized' },
        })
      })
    })

    describe('with invalid data', () => {
      it('should call onError callback with TypeError', async () => {
        const promise = uploadBinaryMedia(
          { ...documentCapture, file: {} as Blob },
          url,
          jwtToken
        )

        await expect(promise).rejects.toMatchObject(
          /TypeError: file.arrayBuffer is not a function/
        )
      })
    })
  })
})
