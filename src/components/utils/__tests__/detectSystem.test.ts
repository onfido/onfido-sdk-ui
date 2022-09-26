import detectSystem from '../detectSystem'

const mockWindowNavigator = (overridenData: Partial<Navigator>) => {
  const originalWindow = { ...window }
  const windowSpy = jest.spyOn(global.window, 'navigator', 'get')

  windowSpy.mockImplementation(() => ({
    ...originalWindow.navigator,
    ...overridenData,
  }))
}

describe('utils', () => {
  describe('detectSystem', () => {
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
          expect(detectSystem('os')).toMatchObject({
            name: 'Macintosh',
            version: '10.15.6',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Chrome',
            version: '85.0.4183.102',
          })
        })
      })

      describe('with Firefox', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion: '5.0 (Macintosh)',
            platform: 'MacIntel',
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0',
            vendor: '',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Macintosh',
            version: '10.15',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Firefox',
            version: '80.0',
          })
        })
      })

      describe('with Safari', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
            platform: 'MacIntel',
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15',
            vendor: 'Apple Computer, Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Macintosh',
            version: '10.15.6',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Safari',
            version: '13.1.2',
          })
        })
      })

      describe('with Opera', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178',
            platform: 'MacIntel',
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 OPR/70.0.3728.178',
            vendor: 'Google Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Macintosh',
            version: '10.15.6',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Opera',
            version: '70.0.3728.178',
          })
        })
      })
    })

    describe('on Windows', () => {
      describe('with Edge', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.41',
            platform: 'Win32',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36 Edg/85.0.564.41',
            vendor: 'Google Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Windows',
            version: '10.0',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Edge',
            version: '85.0.564.41',
          })
        })
      })

      describe('with IE11', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko',
            platform: 'Win32',
            userAgent:
              'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko',
            vendor: '',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Windows',
            version: '10.0',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Internet Explorer',
            version: '11.0',
          })
        })
      })

      describe('with Yandex', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 YaBrowser/14.12.2125.9579 Safari/537.36',
            platform: 'Win32',
            userAgent:
              'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 YaBrowser/14.12.2125.9579 Safari/537.36',
            vendor: 'Yandex',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Windows',
            version: '6.3',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Yandex',
            version: '14.12.2125.9579',
          })
        })
      })
    })

    describe('on iPhone', () => {
      describe('with Google Chrome', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/85.0.4183.109 Mobile/15E148 Safari/604.1',
            platform: 'iPhone',
            userAgent:
              'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/85.0.4183.109 Mobile/15E148 Safari/604.1',
            vendor: 'Apple Computer, Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'iPhone',
            version: '13.7',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Chrome iOS',
            version: '85.0.4183.109',
          })
        })
      })

      describe('with Firefox', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (iPhone; CPU OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/28.1 Mobile/15E148 Safari/605.1.15',
            platform: 'iPhone',
            userAgent:
              'Mozilla/5.0 (iPhone; CPU OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/28.1 Mobile/15E148 Safari/605.1.15',
            vendor: 'Apple Computer, Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'iPhone',
            version: '13.7',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Firefox iOS',
            version: '28.1',
          })
        })
      })

      describe('with Safari', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1',
            platform: 'iPhone',
            userAgent:
              'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1',
            vendor: 'Apple Computer, Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'iPhone',
            version: '13.7',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Safari',
            version: '13.1.2',
          })
        })
      })

      describe('with Opera Touch', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) OPT/2.4.4 Mobile/15E148',
            platform: 'iPhone',
            userAgent:
              'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) OPT/2.4.4 Mobile/15E148',
            vendor: 'Apple Computer, Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'iPhone',
            version: '13.7',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Opera Touch',
            version: '2.4.4',
          })
        })
      })

      describe('with UC Browser', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X; en-US) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/17H35 UCBrowser/11.3.5.1203 Mobile',
            platform: 'iPhone',
            userAgent:
              'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X; en-US) AppleWebKit/537.51.1 (KHTML, like Gecko) Mobile/17H35 UCBrowser/11.3.5.1203 Mobile',
            vendor: 'Apple Computer, Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'iPhone',
            version: '13.7',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'UC Browser',
            version: '11.3.5.1203',
          })
        })
      })
    })

    describe('on iPad', () => {
      describe('with Safari', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (iPad; CPU OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
            platform: 'iPad',
            userAgent:
              'Mozilla/5.0 (iPad; CPU OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
            vendor: 'Apple Computer, Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'iPad',
            version: '12.1',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Safari',
            version: '12.0',
          })
        })
      })
    })

    describe('on Samsung Phone', () => {
      describe('with Samsung Browser', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Linux; Android 9; SAMSUNG SM-G973F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.0 Chrome/67.0.3396.87 Mobile Safari/537.36',
            platform: 'Linux armv8l',
            userAgent:
              'Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G973F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.0 Chrome/67.0.3396.87 Mobile Safari/537.36',
            vendor: 'Google Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Android',
            version: '9',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Samsung Browser',
            version: '9.0',
          })
        })
      })

      describe('with UC Browser', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Linux; U; Android 9; en-US; SM-G973F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.10.2.1164 Mobile Safari/537.36',
            platform: 'Linux armv8l',
            userAgent:
              'Mozilla/5.0 (Linux; U; Android 9; en-US; SM-G973F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/57.0.2987.108 UCBrowser/12.10.2.1164 Mobile Safari/537.36',
            vendor: 'Google Inc.',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Android',
            version: '9',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'UC Browser',
            version: '12.10.2.1164',
          })
        })
      })
    })

    describe('on Google Pixel 4', () => {
      describe('with Firefox', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion: '5.0 (Android 10)',
            platform: 'Linux armv8l',
            userAgent:
              'Mozilla/5.0 (Android 10; Mobile; rv:65.0) Gecko/65.0 Firefox/65.0',
            vendor: '',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Android',
            version: '10',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Firefox',
            version: '65.0',
          })
        })
      })
    })

    describe('on Windows Phone', () => {
      describe('with IE Mobile', () => {
        beforeEach(() => {
          mockWindowNavigator({
            appVersion:
              '5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; Microsoft; Virtual) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
            platform: 'Win32',
            userAgent:
              'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; Microsoft; Virtual) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
            vendor: '',
          })
        })

        it('should extract correct system info', () => {
          expect(detectSystem('os')).toMatchObject({
            name: 'Windows Phone',
            version: '8.1',
          })
          expect(detectSystem('browser')).toMatchObject({
            name: 'Internet Explorer Mobile',
            version: '11.0',
          })
        })
      })
    })
  })
})
