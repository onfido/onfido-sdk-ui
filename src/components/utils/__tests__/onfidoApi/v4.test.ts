import { createV4Document, uploadBinaryMedia } from '../../onfidoApi'
import createMockXHR from '~jest/createMockXHR'
import { fakeCreateV4DocumentResponse } from '~jest/responses'
import { hmac256 } from '~utils/blob'
import { performHttpReq } from '~utils/http'

jest.mock('../../blob')
jest.mock('../../http')

const url = 'https://test.url.com'

/**
 * exp: 1614106934
 * uuid: 'oghRY_bk774'
 */
const jwtToken =
  'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE2MTQxMDY5MzQsInBheWxvYWQiOnsiYXBwIjoiZTgwMDIzMDQtOWUzOS00MWMzLThkYTYtYTc3OWRjNjU4MWRiIiwicmVmIjoiKjovLyovKiJ9LCJ1dWlkIjoib2doUllfYms3NzQiLCJ1cmxzIjp7InRlbGVwaG9ueV91cmwiOiJodHRwczovL3RlbGVwaG9ueS5ldS13ZXN0LTEuZGV2Lm9uZmlkby54eXoiLCJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9maW5kLWRvY3VtZW50LWluLWltYWdlLmV1LXdlc3QtMS5kZXYub25maWRvLnh5eiIsInN5bmNfdXJsIjoiaHR0cHM6Ly9jcm9zcy1kZXZpY2Utc3luYy5ldS13ZXN0LTEuZGV2Lm9uZmlkby54eXoiLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQuZXUtd2VzdC0xLmRldi5vbmZpZG8ueHl6IiwiYXV0aF91cmwiOiJodHRwczovL2FwaS1nYXRld2F5LmV1LXdlc3QtMS5kZXYub25maWRvLnh5eiIsIm9uZmlkb19hcGlfdXJsIjoiaHR0cHM6Ly9hcGkuZXUtd2VzdC0xLmRldi5vbmZpZG8ueHl6In19.MIGHAkIBmsdivlJi3BuvZpR2yMLN72nWOmfYfuw4Gk_uhgT6WvNzFOs94q_bxC7MGylukLVTSrldrjcRsEQ1PFhWBbyaEPACQUBeelkbf5VAp3FOq0HNLsixFQdOLLnramFXE0ZDK29u30fnsmpxn3bb-ru7FmOAEfu5Pm712NRdvVo1jn7tpPDo'

const documentCapture = {
  file: new Blob(),
  filename: 'applicant_selfie.jpg',
  sdkMetadata: {},
}

const mockedHmac256 = hmac256 as jest.MockedFunction<typeof hmac256>
const mockedPerformHttpReq = performHttpReq as jest.MockedFunction<
  typeof performHttpReq
>
const mockedOnSuccess = jest.fn()
const mockedOnError = jest.fn()

const runAllPromises = () => new Promise(setImmediate)

describe('onfidoApi', () => {
  describe('uploadBinaryMedia', () => {
    beforeEach(() => {
      Blob.prototype.arrayBuffer = jest
        .fn()
        .mockResolvedValue(new ArrayBuffer(0))

      mockedHmac256.mockResolvedValue('fake-hmac')
    })

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

        const [params] = mockedPerformHttpReq.mock.calls[0]
        expect(params).toMatchObject({
          endpoint: `${url}/v4/binary_media`,
          headers: { 'X-Video-Auth': 'fake-hmac' },
          token: `Bearer ${jwtToken}`,
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

  describe.skip('createV4Document', () => {
    let mockXHR: XMLHttpRequest = null

    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })

    describe('with valid data', () => {
      const fakeBinaryMediaIds = ['fake-id-1', 'fake-id-2']

      beforeEach(() => {
        mockXHR = createMockXHR({ response: fakeCreateV4DocumentResponse })
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

        expect(mockedOnSuccess).toHaveBeenCalledWith(
          fakeCreateV4DocumentResponse
        )
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
