// eslint-disable-next-line jest/no-mocks-import
import '../__mocks__/mockServer'
import { Network } from '../Network'

describe('Module: Network', () => {
  it('http request - with error (404)', (done) => {
    const successMock = jest.fn()
    const network = new Network()

    network.performHttpRequest(
      {
        method: 'GET',
        endpoint: 'http://localhost:3000/404',
      },
      successMock,
      (request) => {
        expect(request.status).toBe(404)
        expect(successMock).not.toBeCalled()
        done()
      }
    )
  })

  it('http request - with error (0)', (done) => {
    const successMock = jest.fn()
    const network = new Network()

    network.performHttpRequest(
      {
        method: 'GET',
        endpoint: 'http://localhost:3000/error',
      },
      successMock,
      (request) => {
        expect(request.status).toBe(0)
        expect(successMock).not.toBeCalled()
        done()
      }
    )
  })

  it('http request - with error (onRequestErrorResponse callback)', (done) => {
    const successMock = jest.fn()
    const network = new Network({
      onRequestErrorResponse: (request) => {
        expect(request).not.toBeNull()
        done()
      },
    })

    network.performHttpRequest(
      {
        method: 'GET',
        endpoint: 'http://localhost:3000/404',
      },
      successMock,
      (request) => {
        expect(request.status).toBe(404)
        expect(successMock).not.toBeCalled()
      }
    )
  })
})
