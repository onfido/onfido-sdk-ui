import { extractSystemInfo } from '../index'

const mockWindowNavigator = (overridenData) => {
  const originalWindow = { ...window }
  const windowSpy = jest.spyOn(global, 'window', 'get')

  windowSpy.mockImplementation(() => ({
    ...originalWindow,
    navigator: {
      ...originalWindow.navigator,
      ...overridenData,
    },
  }))
}

describe('utils', () => {
  describe('extractSystemInfo', () => {
    describe('on Macintosh', () => {
      describe('with Google Chrome', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
            platform: 'MacIntel',
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36',
            vendor: 'Google Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(extractSystemInfo('os')).toMatchObject({
            name: 'Macintosh',
            version: '10.15.6',
          })
          expect(extractSystemInfo('browser')).toMatchObject({
            name: 'Chrome',
            version: '85.0.4183.102',
          })
        })
      })
    })
  })
})
