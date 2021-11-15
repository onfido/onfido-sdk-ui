import { sendMultiframeSelfie } from '../../onfidoApi'
import createMockXHR from '~jest/createMockXHR'
import { TRACKED_EVENT_TYPES } from '../../../../Tracker'
import { ParsedError } from '~types/api'

const url = 'https://test.url.com'
const jwtToken = 'fake.token'

const snapshotData = {
  blob: new Blob(),
  filename: 'applicant_selfie.jpg',
}

const selfieData = {
  blob: new Blob(),
  filename: 'applicant_selfie.jpg',
  sdkMetadata: {},
}

const mockedOnSuccess = jest.fn()
const mockedOnError = jest.fn()
const mockedTrackingCallback = jest.fn()
let xhrMock: XMLHttpRequest

describe('onfidoApi', () => {
  describe('sendMultiframeSelfie', () => {
    afterEach(() => {
      jest.clearAllMocks()
      jest.restoreAllMocks()
    })

    describe('with valid data', () => {
      it('should send two XHR requests', async () => {
        const snapShotsXhr: XMLHttpRequest = createMockXHR({
          response: { payload: 'success' },
        })
        const livePhotoXhr = createMockXHR({ response: { payload: 'success' } })
        let times = 0

        // when send is called trigger the onload function
        livePhotoXhr.send = () => {
          times++
          livePhotoXhr.onload &&
            livePhotoXhr.onload(new ProgressEvent('upload live photo'))
        }

        const failXhr = createMockXHR({ response: { payload: 'fail' } })

        const xhrs = [snapShotsXhr, livePhotoXhr]

        jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => {
          return xhrs.shift() || failXhr
        })

        sendMultiframeSelfie(
          snapshotData,
          selfieData,
          jwtToken,
          url,
          mockedOnSuccess,
          mockedOnError,
          mockedTrackingCallback
        )

        snapShotsXhr.onload &&
          snapShotsXhr.onload(new ProgressEvent('upload snapshots')) // Upload snapshots

        expect(mockedTrackingCallback).toHaveBeenCalledWith(
          'Starting snapshot upload',
          TRACKED_EVENT_TYPES.action
        )
        expect(snapShotsXhr.open).toHaveBeenCalledWith(
          'POST',
          `${url}/v3/snapshots`
        )
        expect(snapShotsXhr.send).toHaveBeenCalled()

        // as the sendMultiframeSelfie function is async with 2 calls, we need to give it some time, till the the open function is called
        await (async () => {
          return new Promise((r) => setTimeout(r, 100))
        })

        expect(livePhotoXhr.open).toHaveBeenCalledWith(
          'POST',
          `${url}/v3/live_photos`
        )

        expect(times).toBe(1)
        expect(mockedOnSuccess).toHaveBeenCalledWith({ payload: 'success' })
        expect(mockedOnError).not.toHaveBeenCalled()

        expect(mockedTrackingCallback).toHaveBeenCalledWith(
          'Snapshot upload completed',
          TRACKED_EVENT_TYPES.action
        )
        expect(mockedTrackingCallback).toHaveBeenCalledWith(
          'Starting live photo upload',
          TRACKED_EVENT_TYPES.action
        )
      })
    })

    describe('with request error', () => {
      it('should call onError callback', () => {
        return new Promise((okay, error) => {
          const mockXHR = createMockXHR({
            status: 401,
            response: { error: 'unauthorized' },
          })
          jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => mockXHR)

          sendMultiframeSelfie(
            snapshotData,
            selfieData,
            jwtToken,
            url,
            () => {
              error('success should not be called')
            },
            (e: ParsedError) => {
              try {
                expect(e.status).toEqual(401)
                expect(e.response).toEqual({ error: 'unauthorized' })
                okay(null)
              } catch (e) {
                error(e)
              }
            },
            mockedTrackingCallback
          )

          mockXHR.onload && mockXHR.onload(new ProgressEvent('error'))

          expect(mockXHR.send).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('with invalid data', () => {
      it('should call onError callback with TypeError', async () => {
        return new Promise((okay, error) => {
          xhrMock = createMockXHR({})
          jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => xhrMock)

          const invalidSnapshotData = { ...snapshotData, blob: {} as Blob }
          const invalidSelfieData = { ...selfieData, blob: {} as Blob }

          sendMultiframeSelfie(
            invalidSnapshotData,
            invalidSelfieData,
            jwtToken,
            url,
            () => {
              error('success should not be invoked')
            },
            (e) => {
              // @ts-ignore
              const ex: TypeError = e as TypeError

              try {
                expect(ex.constructor.name).toEqual('TypeError')
                expect(ex.message).toEqual(
                  `Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'.`
                )

                okay(null)
              } catch (e) {
                console.error(e)
              }
            },
            mockedTrackingCallback
          )

          xhrMock.onload && xhrMock.onload(new ProgressEvent('Type error'))

          expect(xhrMock.send).not.toHaveBeenCalled()
        })
      })
    })
  })
})
