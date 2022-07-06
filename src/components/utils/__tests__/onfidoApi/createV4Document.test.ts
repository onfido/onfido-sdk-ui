import { jwtToken, fakeCreateV4DocumentResponse } from '~jest/responses'
import { performHttpRequest } from '~core/Network'
import { createV4Document } from '~utils/onfidoApi'

jest.mock('~utils/blob')
jest.mock('~core/Network')

const url = 'https://test.url.com'

const mockedPerformHttpReq = performHttpRequest as jest.MockedFunction<
  typeof performHttpRequest
>

describe('onfidoApi', () => {
  describe('createV4Document', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    describe('with valid data', () => {
      const fakeBinaryMediaIds = ['fake-id-1', 'fake-id-2']

      beforeEach(() => {
        mockedPerformHttpReq.mockImplementation((_params, onSuccess) =>
          onSuccess(fakeCreateV4DocumentResponse)
        )
      })

      it('sends correct request', async () => {
        const response = await createV4Document(
          fakeBinaryMediaIds,
          url,
          jwtToken
        )
        expect(response).toEqual(fakeCreateV4DocumentResponse)

        const [params] = mockedPerformHttpReq.mock.calls[0]
        expect(params).toMatchObject({
          contentType: 'application/json',
          endpoint: `${url}/v4/documents`,
          payload: JSON.stringify({
            document_media: [
              { binary_media: { uuid: 'fake-id-1' } },
              { binary_media: { uuid: 'fake-id-2' } },
            ],
          }),
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
        const promise = createV4Document([], url, jwtToken)
        await expect(promise).rejects.toMatchObject({
          status: 401,
          response: { error: 'unauthorized' },
        })
      })
    })
  })
})
