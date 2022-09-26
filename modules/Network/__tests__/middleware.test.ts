// eslint-disable-next-line jest/no-mocks-import
import '../__mocks__/mockServer'
import { Network } from '../Network'

type RequestResponse = {
  ping: string
}

describe('Module: Network', () => {
  describe('with middleware', () => {
    it('return void', (done) => {
      const errorMock = jest.fn()
      const middlewareMock = jest.fn()

      const network = new Network({
        middleware: [middlewareMock],
      })

      network.performHttpRequest(
        {
          method: 'GET',
          endpoint: 'http://localhost:3000/json',
        },
        (response: RequestResponse) => {
          expect(response).toEqual({ ping: 'pong' })
          expect(errorMock).not.toBeCalled()
          done()
        },
        errorMock
      )
    })

    it('return httpDataParams', (done) => {
      const errorMock = jest.fn()
      const middlewareMock = jest.fn((data) => data)

      const network = new Network({
        middleware: [middlewareMock],
      })

      network.performHttpRequest(
        {
          method: 'GET',
          endpoint: 'http://localhost:3000/json',
        },
        (response: RequestResponse) => {
          expect(response).toEqual({ ping: 'pong' })
          expect(errorMock).not.toBeCalled()
          done()
        },
        errorMock
      )
    })

    it('return void - with Error - with onMiddlewareError callback', (done) => {
      const errorMock = jest.fn()
      const middlewareMock = jest.fn(() => {
        throw new Error('hi')
      })

      const network = new Network({
        middleware: [middlewareMock],
        onMiddlewareError: (error) => {
          expect(error).not.toBeNull()
        },
      })

      network.performHttpRequest(
        {
          method: 'GET',
          endpoint: 'http://localhost:3000/json',
        },
        (request: RequestResponse) => {
          expect(request).toEqual({ ping: 'pong' })
          expect(errorMock).not.toBeCalled()
          done()
        },
        errorMock
      )
    })

    it('return void - with Error - without onMiddlewareError callback', (done) => {
      const successMock = jest.fn()
      const errorMock = jest.fn()
      const middlewareMock = jest.fn(() => {
        throw new Error('hi')
      })

      const network = new Network({
        middleware: [middlewareMock],
      })

      expect(() => {
        network.performHttpRequest(
          {
            method: 'GET',
            endpoint: 'http://localhost:3000/json',
          },
          successMock,
          errorMock
        )
      }).toThrowError()
      expect(errorMock).not.toBeCalled()
      expect(successMock).not.toBeCalled()
      done()
    })
  })
})
