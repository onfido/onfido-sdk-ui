import { hmac256 } from '../blob'

describe('utils', () => {
  describe('blob', () => {
    describe('hmac256', () => {
      beforeAll(() => {
        if (typeof global.TextEncoder === 'undefined') {
          global.TextEncoder = require('util').TextEncoder // eslint-disable-line @typescript-eslint/no-var-requires
        }

        if (typeof global.TextDecoder === 'undefined') {
          global.TextDecoder = require('util').TextDecoder // eslint-disable-line @typescript-eslint/no-var-requires
        }

        // At the moment of implementing this,
        // we're using Node 14, which hasn't supported Web Crypto APIs yet
        // @TODO: use Node.js Web Crypto API once the project is updated to use Node 15
        // @SEE: https://nodejs.org/api/webcrypto.html#webcrypto_web_crypto_api
        if (typeof window.crypto === 'undefined') {
          Object.assign(window, {
            crypto: {
              subtle: {
                importKey: jest.fn().mockResolvedValue('fake-crypto-key'),
                sign: jest
                  .fn()
                  .mockResolvedValue(
                    new TextEncoder().encode('fake-signature')
                  ),
              },
            },
          })
        }
      })

      it('triggers correct Web Crypto APIs', async () => {
        const mockedImportKey = window.crypto.subtle
          .importKey as jest.MockedFunction<
          typeof window.crypto.subtle.importKey
        >
        const mockedSign = window.crypto.subtle.sign as jest.MockedFunction<
          typeof window.crypto.subtle.sign
        >

        const hmac = await hmac256('fake-secret', new ArrayBuffer(0))

        expect(mockedImportKey).toHaveBeenCalled()
        const [format, keyData, importAlgo] = mockedImportKey.mock.calls[0]
        expect(format).toEqual('raw')
        expect(new TextDecoder().decode(keyData as Uint8Array)).toEqual(
          'fake-secret'
        )
        expect(importAlgo).toMatchObject({
          name: 'HMAC',
          hash: { name: 'SHA-256' },
        })
        expect(mockedSign).toHaveBeenCalled()
        const [signAlgo, cryptoKey] = mockedSign.mock.calls[0]
        expect(signAlgo).toEqual('HMAC')
        expect(cryptoKey).toEqual('fake-crypto-key')

        expect(hmac).toEqual('66616b652d7369676e6174757265') // hex value of 'fake-signature'
      })
    })
  })
})
