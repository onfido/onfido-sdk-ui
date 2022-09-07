// eslint-disable-next-line jest/no-mocks-import
import '../__mocks__/mockServer'
import { Network } from '../Network'

type RequestResponse = {
  ping: string
}

describe('Module: Network', () => {
  it('Create new instance', () => {
    const network = new Network()
    expect(network).toBeInstanceOf(Network)
  })

  it('http request - json response', (done) => {
    const errorMock = jest.fn()
    const network = new Network()

    // @ts-ignore
    window.sessionId = 'test'

    network.performHttpRequest(
      {
        method: 'GET',
        endpoint: 'http://localhost:3000/json',
        contentType: 'application/json',
        headers: {
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
        },
        token: 'token',
      },
      (response: RequestResponse) => {
        expect(response).toEqual({ ping: 'pong' })
        expect(errorMock).not.toBeCalled()
        done()
      },
      errorMock
    )
  })

  it('http request - raw response', (done) => {
    const errorMock = jest.fn()

    const network = new Network()

    network.performHttpRequest(
      {
        method: 'GET',
        endpoint: 'http://localhost:3000/raw',
      },
      (request: string) => {
        expect(request).toBe('{"ping":"pong"}')
        expect(errorMock).not.toBeCalled()
        done()
      },
      errorMock
    )
  })

  it('http request - 204 no content', (done) => {
    const errorMock = jest.fn()
    const network = new Network()

    network.performHttpRequest(
      {
        method: 'GET',
        endpoint: 'http://localhost:3000/204',
      },
      (request: string) => {
        expect(request).toEqual('')
        expect(errorMock).not.toBeCalled()
        done()
      },
      errorMock
    )
  })
})
