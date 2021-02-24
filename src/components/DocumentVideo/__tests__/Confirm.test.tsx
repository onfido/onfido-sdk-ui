import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
  MockedStore,
} from '~jest/MockedReduxProvider'
import { fakeDocumentCaptureState } from '~jest/captures'
import {
  fakePassportImageResponse,
  fakePassportVideoResponse,
  fakeDrivingLicenceFrontResponse,
  fakeDrivingLicenceBackResponse,
  fakeDrivingLicenceVideoResponse,
  fakeCreateV4DocumentResponse,
  fakeNoDocumentError,
  fakeUnknownError,
  fakeAccessDeniedError,
} from '~jest/responses'
import {
  uploadDocument,
  uploadDocumentVideo,
  uploadBinaryMedia,
  createV4Document,
} from '~utils/onfidoApi'
import '../../utils/__mocks__/objectUrl' // eslint-disable-line jest/no-mocks-import
import Confirm from '../Confirm'

import type { ApiParsedError } from '~types/api'
import type { StepComponentDocumentProps } from '~types/routers'

jest.mock('../../utils/onfidoApi')

const fakeUrl = 'https://fake-api.onfido.com'
const fakeToken = 'fake-sdk-token'

const mockedUploadDocument = uploadDocument as jest.MockedFunction<
  typeof uploadDocument
>
const mockedUploadDocumentVideo = uploadDocumentVideo as jest.MockedFunction<
  typeof uploadDocumentVideo
>
const mockedUploadBinaryMedia = uploadBinaryMedia as jest.MockedFunction<
  typeof uploadBinaryMedia
>
const mockedCreateV4Document = createV4Document as jest.MockedFunction<
  typeof createV4Document
>

const runAllPromises = () => new Promise(setImmediate)

const defaultProps: StepComponentDocumentProps = {
  allowCrossDeviceFlow: true,
  componentsList: [],
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  resetSdkFocus: jest.fn(),
  step: 0,
  stepIndexType: 'user',
  trackScreen: jest.fn(),
  triggerOnError: jest.fn(),
  ...mockedReduxProps,
}

const simulateButtonClick = (wrapper: ReactWrapper, primary = true) =>
  wrapper
    .find(`button.button-${primary ? 'primary' : 'secondary'}`)
    .simulate('click')

const assertButton = (
  wrapper: ReactWrapper,
  buttonClass: string,
  buttonText: string
) => {
  const button = wrapper.find(`button.${buttonClass}`)
  expect(button.exists()).toBeTruthy()
  expect(button.text()).toEqual(buttonText)
  expect(button.hasClass('button-lg button-centered')).toBeTruthy()
}

const assertError = (wrapper: ReactWrapper, noDoc = false) => {
  expect(wrapper.find('.content').exists()).toBeFalsy()
  expect(wrapper.find('.preview').exists()).toBeFalsy()
  expect(wrapper.find('button.button-primary').exists()).toBeTruthy()

  expect(wrapper.find('Error').exists()).toBeTruthy()

  if (noDoc) {
    expect(wrapper.find('Error .title').text()).toEqual(
      'doc_confirmation.alert.no_doc_title'
    )
    expect(wrapper.find('Error .instruction').text()).toEqual(
      'doc_confirmation.alert.no_doc_detail'
    )
  } else {
    expect(wrapper.find('Error .title').text()).toEqual(
      'generic.errors.request_error.message'
    )
    expect(wrapper.find('Error .instruction').text()).toEqual(
      'generic.errors.request_error.instruction'
    )
  }

  assertButton(
    wrapper,
    'button-secondary',
    'doc_video_confirmation.button_redo'
  )
  simulateButtonClick(wrapper, false)
  expect(defaultProps.previousStep).toHaveBeenCalled()
}

const assertContent = (
  wrapper: ReactWrapper,
  variant: 'default' | 'preview'
) => {
  expect(wrapper.find('Spinner').exists()).toBeFalsy()
  expect(wrapper.find('Error').exists()).toBeFalsy()
  expect(wrapper.find('button.button-primary').exists()).toBeTruthy()
  expect(wrapper.find('button.button-secondary').exists()).toBeTruthy()

  if (variant === 'preview') {
    expect(wrapper.find('.content').exists()).toBeFalsy()

    expect(wrapper.find('.preview').exists()).toBeTruthy()
    expect(wrapper.find('.preview > .title').text()).toEqual(
      'doc_video_confirmation.preview_title'
    )
    expect(wrapper.find('.preview > CaptureViewer').exists()).toBeTruthy()
    return
  }

  // Default
  expect(wrapper.find('.content').exists()).toBeTruthy()
  expect(wrapper.find('.content > .icon').exists()).toBeTruthy()
  expect(wrapper.find('.content > .title').text()).toEqual(
    'doc_video_confirmation.title'
  )
  expect(wrapper.find('.content > .body').text()).toEqual(
    'doc_video_confirmation.body'
  )
  expect(wrapper.find('.preview').exists()).toBeFalsy()
}

const assertSpinner = (wrapper: ReactWrapper) => {
  expect(wrapper.find('Spinner').exists()).toBeTruthy()
  expect(wrapper.find('.content').exists()).toBeFalsy()
  expect(wrapper.find('CaptureViewer').exists()).toBeFalsy()
  expect(wrapper.find('button.button-primary').exists()).toBeFalsy()
  expect(wrapper.find('button.button-secondary').exists()).toBeFalsy()
}

describe('DocumentVideo', () => {
  describe('Confirm', () => {
    let wrapper: ReactWrapper
    let mockedStore: MockedStore

    beforeEach(() => {
      jest.useFakeTimers()

      wrapper = mount(
        <MockedReduxProvider>
          <MockedLocalised>
            <Confirm {...defaultProps} />
          </MockedLocalised>
        </MockedReduxProvider>
      )
    })

    afterEach(() => {
      jest.clearAllMocks()
      mockedStore && mockedStore.clearActions()
    })

    it('renders items correctly', () => {
      assertContent(wrapper, 'default')

      assertButton(
        wrapper,
        'button-primary',
        'doc_video_confirmation.button_upload'
      )

      assertButton(
        wrapper,
        'button-secondary',
        'doc_video_confirmation.button_preview'
      )
    })

    describe('with passport captures', () => {
      const fakeDocumentType = 'passport'
      const fakeFrontPayload = fakeDocumentCaptureState(
        fakeDocumentType,
        'standard',
        'front'
      )
      const fakeVideoPayload = fakeDocumentCaptureState(
        fakeDocumentType,
        'video'
      )

      beforeEach(() => {
        wrapper = mount(
          <MockedReduxProvider
            overrideCaptures={{
              document_front: fakeFrontPayload,
              document_video: fakeVideoPayload,
            }}
            overrideGlobals={{
              urls: {
                onfido_api_url: fakeUrl,
              },
            }}
            storeRef={(store) => (mockedStore = store)}
          >
            <MockedLocalised>
              <Confirm
                {...defaultProps}
                documentType={fakeDocumentType}
                token={fakeToken}
              />
            </MockedLocalised>
          </MockedReduxProvider>
        )
      })

      it('shows capture viewer when click on preview', () => {
        simulateButtonClick(wrapper, false)
        assertContent(wrapper, 'preview')

        assertButton(
          wrapper,
          'button-secondary',
          'doc_video_confirmation.button_redo'
        )
      })

      it('goes back when click on redo', () => {
        simulateButtonClick(wrapper, false) // Preview
        simulateButtonClick(wrapper, false) // Redo
        expect(defaultProps.previousStep).toHaveBeenCalled()
      })

      describe('when upload success - v3 APIs', () => {
        if (process.env.USE_V4_APIS_FOR_DOC_VIDEO === 'true') {
          return
        }

        beforeEach(() => {
          mockedUploadDocument.mockResolvedValue(fakePassportImageResponse)
          mockedUploadDocumentVideo.mockResolvedValue(fakePassportVideoResponse)
          simulateButtonClick(wrapper)
        })

        it('renders spinner correctly', async () => {
          assertSpinner(wrapper)

          await runAllPromises()

          expect(mockedUploadDocument).toHaveBeenCalledWith(
            {
              file: fakeFrontPayload.blob,
              sdkMetadata: fakeFrontPayload.sdkMetadata,
              side: 'front',
              type: fakeDocumentType,
              validations: { detect_document: 'error' },
            },
            fakeUrl,
            fakeToken
          )
          expect(mockedUploadDocumentVideo).toHaveBeenCalledWith(
            {
              blob: fakeVideoPayload.blob,
              sdkMetadata: fakeVideoPayload.sdkMetadata,
            },
            fakeUrl,
            fakeToken
          )

          expect(mockedUploadDocument).toHaveBeenCalledTimes(1)

          expect(mockedStore.getActions()).toMatchObject([
            {
              type: 'SET_CAPTURE_METADATA',
              payload: {
                captureId: fakeFrontPayload.id,
                metadata: {
                  id: fakePassportImageResponse.id,
                  type: fakeDocumentType,
                  side: 'front',
                },
              },
            },
            {
              type: 'SET_CAPTURE_METADATA',
              payload: {
                captureId: fakeVideoPayload.id,
                metadata: {
                  id: fakePassportVideoResponse.id,
                  type: fakeDocumentType,
                },
              },
            },
          ])

          expect(defaultProps.nextStep).toHaveBeenCalled()
        })
      })

      describe('when upload success - v4 APIs', () => {
        if (process.env.USE_V4_APIS_FOR_DOC_VIDEO !== 'true') {
          return
        }

        const imageMediaUuid = 'fake-image-media-id'
        const videoMediaUuid = 'fake-image-media-id'

        beforeEach(() => {
          mockedUploadBinaryMedia
            .mockResolvedValueOnce({
              media_id: imageMediaUuid,
            })
            .mockResolvedValueOnce({
              media_id: videoMediaUuid,
            })
          mockedCreateV4Document.mockResolvedValue(fakeCreateV4DocumentResponse)
          simulateButtonClick(wrapper)
        })

        it('renders spinner correctly', async () => {
          assertSpinner(wrapper)

          await runAllPromises()

          expect(mockedUploadBinaryMedia).toHaveBeenCalledWith(
            {
              file: fakeFrontPayload.blob,
              filename: fakeFrontPayload.filename,
              sdkMetadata: fakeFrontPayload.sdkMetadata,
            },
            fakeUrl,
            fakeToken
          )
          expect(mockedUploadBinaryMedia).toHaveBeenCalledWith(
            {
              file: fakeVideoPayload.blob,
              filename: fakeVideoPayload.filename,
              sdkMetadata: fakeVideoPayload.sdkMetadata,
            },
            fakeUrl,
            fakeToken,
            true // includes file HMAC Auth
          )
          expect(mockedCreateV4Document).toHaveBeenCalledWith(
            [imageMediaUuid, videoMediaUuid],
            fakeUrl,
            fakeToken
          )

          expect(mockedUploadBinaryMedia).toHaveBeenCalledTimes(2)
          expect(mockedCreateV4Document).toHaveBeenCalledTimes(1)

          expect(mockedStore.getActions()).toMatchObject([
            {
              type: 'CAPTURE_DELETE',
              payload: { method: 'document', side: 'front' },
            },
            {
              type: 'SET_CAPTURE_METADATA',
              payload: {
                captureId: fakeVideoPayload.id,
                metadata: {
                  id: fakeCreateV4DocumentResponse.uuid,
                  media_uuids: [imageMediaUuid, videoMediaUuid],
                },
              },
            },
          ])

          expect(defaultProps.nextStep).toHaveBeenCalled()
        })
      })
    })

    describe('with driving licence captures', () => {
      const fakeDocumentType = 'driving_licence'
      const fakeFrontPayload = fakeDocumentCaptureState(
        fakeDocumentType,
        'standard',
        'front'
      )
      const fakeBackPayload = fakeDocumentCaptureState(
        fakeDocumentType,
        'standard',
        'back'
      )
      const fakeVideoPayload = fakeDocumentCaptureState(
        fakeDocumentType,
        'video'
      )

      beforeEach(() => {
        wrapper = mount(
          <MockedReduxProvider
            overrideCaptures={{
              document_front: fakeFrontPayload,
              document_back: fakeBackPayload,
              document_video: fakeVideoPayload,
            }}
            overrideGlobals={{
              idDocumentIssuingCountry: {
                name: 'United States of America',
                country_alpha2: 'US',
                country_alpha3: 'USA',
              },
              urls: {
                onfido_api_url: fakeUrl,
              },
            }}
            storeRef={(store) => (mockedStore = store)}
          >
            <MockedLocalised>
              <Confirm
                {...defaultProps}
                documentType={fakeDocumentType}
                token={fakeToken}
              />
            </MockedLocalised>
          </MockedReduxProvider>
        )
      })

      it('shows capture viewer when click on preview', () => {
        simulateButtonClick(wrapper, false)
        assertContent(wrapper, 'preview')

        assertButton(
          wrapper,
          'button-secondary',
          'doc_video_confirmation.button_redo'
        )
      })

      it('goes back when click on redo', () => {
        simulateButtonClick(wrapper, false) // Preview
        simulateButtonClick(wrapper, false) // Redo
        expect(defaultProps.previousStep).toHaveBeenCalled()
      })

      describe('when upload success - v3 APIs', () => {
        if (process.env.USE_V4_APIS_FOR_DOC_VIDEO === 'true') {
          return
        }

        beforeEach(() => {
          mockedUploadDocument
            .mockResolvedValueOnce(fakeDrivingLicenceFrontResponse)
            .mockResolvedValue(fakeDrivingLicenceBackResponse)
          mockedUploadDocumentVideo.mockResolvedValue(
            fakeDrivingLicenceVideoResponse
          )
          simulateButtonClick(wrapper)
        })

        it('renders spinner correctly', async () => {
          assertSpinner(wrapper)

          await runAllPromises()

          expect(mockedUploadDocument).toHaveBeenCalledWith(
            {
              file: fakeFrontPayload.blob,
              issuing_country: 'USA',
              sdkMetadata: fakeFrontPayload.sdkMetadata,
              side: 'front',
              type: fakeDocumentType,
              validations: { detect_document: 'error' },
            },
            fakeUrl,
            fakeToken
          )
          expect(mockedUploadDocument).toHaveBeenCalledWith(
            {
              file: fakeBackPayload.blob,
              issuing_country: 'USA',
              sdkMetadata: fakeBackPayload.sdkMetadata,
              side: 'back',
              type: fakeDocumentType,
              validations: { detect_document: 'error' },
            },
            fakeUrl,
            fakeToken
          )
          expect(mockedUploadDocumentVideo).toHaveBeenCalledWith(
            {
              blob: fakeVideoPayload.blob,
              issuing_country: 'USA',
              sdkMetadata: fakeVideoPayload.sdkMetadata,
            },
            fakeUrl,
            fakeToken
          )

          expect(mockedUploadDocument).toHaveBeenCalledTimes(2)

          expect(mockedStore.getActions()).toMatchObject([
            {
              type: 'SET_CAPTURE_METADATA',
              payload: {
                captureId: fakeFrontPayload.id,
                metadata: {
                  id: fakeDrivingLicenceFrontResponse.id,
                  type: fakeDocumentType,
                  side: 'front',
                },
              },
            },
            {
              type: 'SET_CAPTURE_METADATA',
              payload: {
                captureId: fakeBackPayload.id,
                metadata: {
                  id: fakeDrivingLicenceBackResponse.id,
                  type: fakeDocumentType,
                  side: 'back',
                },
              },
            },
            {
              type: 'SET_CAPTURE_METADATA',
              payload: {
                captureId: fakeVideoPayload.id,
                metadata: {
                  id: fakePassportVideoResponse.id,
                  type: fakeDocumentType,
                },
              },
            },
          ])

          expect(defaultProps.nextStep).toHaveBeenCalled()
        })
      })

      describe('when upload success - v4 APIs', () => {
        if (process.env.USE_V4_APIS_FOR_DOC_VIDEO !== 'true') {
          return
        }

        const frontMediaUuid = 'fake-front-media-id'
        const backMediaUuid = 'fake-back-media-id'
        const videoMediaUuid = 'fake-video-media-id'

        beforeEach(() => {
          mockedUploadBinaryMedia
            .mockResolvedValueOnce({
              media_id: frontMediaUuid,
            })
            .mockResolvedValueOnce({
              media_id: backMediaUuid,
            })
            .mockResolvedValueOnce({
              media_id: videoMediaUuid,
            })
          mockedCreateV4Document.mockResolvedValue(fakeCreateV4DocumentResponse)
          simulateButtonClick(wrapper)
        })

        it('renders spinner correctly', async () => {
          assertSpinner(wrapper)

          await runAllPromises()

          expect(mockedUploadBinaryMedia).toHaveBeenCalledWith(
            {
              file: fakeFrontPayload.blob,
              filename: fakeFrontPayload.filename,
              sdkMetadata: fakeFrontPayload.sdkMetadata,
            },
            fakeUrl,
            fakeToken
          )
          expect(mockedUploadBinaryMedia).toHaveBeenCalledWith(
            {
              file: fakeBackPayload.blob,
              filename: fakeBackPayload.filename,
              sdkMetadata: fakeBackPayload.sdkMetadata,
            },
            fakeUrl,
            fakeToken
          )
          expect(mockedUploadBinaryMedia).toHaveBeenCalledWith(
            {
              file: fakeVideoPayload.blob,
              filename: fakeVideoPayload.filename,
              sdkMetadata: fakeVideoPayload.sdkMetadata,
            },
            fakeUrl,
            fakeToken,
            true // includes file HMAC Auth
          )
          expect(mockedCreateV4Document).toHaveBeenCalledWith(
            [frontMediaUuid, backMediaUuid, videoMediaUuid],
            fakeUrl,
            fakeToken
          )

          expect(mockedUploadBinaryMedia).toHaveBeenCalledTimes(3)
          expect(mockedCreateV4Document).toHaveBeenCalledTimes(1)

          expect(mockedStore.getActions()).toMatchObject([
            {
              type: 'CAPTURE_DELETE',
              payload: { method: 'document', side: 'front' },
            },
            {
              type: 'CAPTURE_DELETE',
              payload: { method: 'document', side: 'back' },
            },
            {
              type: 'SET_CAPTURE_METADATA',
              payload: {
                captureId: fakeVideoPayload.id,
                metadata: {
                  id: fakeCreateV4DocumentResponse.uuid,
                  media_uuids: [frontMediaUuid, backMediaUuid, videoMediaUuid],
                },
              },
            },
          ])

          expect(defaultProps.nextStep).toHaveBeenCalled()
        })
      })

      describe('when upload failed - v3 APIs', () => {
        if (process.env.USE_V4_APIS_FOR_DOC_VIDEO === 'true') {
          return
        }

        describe('with no document error', () => {
          beforeEach(() => {
            mockedUploadDocument.mockRejectedValue(fakeNoDocumentError)
            simulateButtonClick(wrapper)
          })

          it('renders INVALID_CAPTURE error correctly', async () => {
            await runAllPromises()
            wrapper.update()
            assertError(wrapper, true)
          })
        })

        describe('with other errors', () => {
          const blankError = { response: {}, status: 422 }

          const fakeErrors: ApiParsedError[] = [
            blankError,
            {
              ...blankError,
              response: {
                error: {
                  type: 'validation_error',
                  message: 'Fake message',
                  fields: {},
                },
              },
            },
            {
              ...blankError,
              response: {
                error: {
                  type: 'validation_error',
                  message: 'Fake message',
                  fields: { document_detection: null },
                },
              },
            },
            fakeUnknownError,
          ]

          fakeErrors.forEach((error) => {
            describe('on error', () => {
              beforeEach(() => {
                mockedUploadDocument.mockRejectedValue(error)
                simulateButtonClick(wrapper)
              })

              it('renders REQUEST_ERROR error correctly', async () => {
                await runAllPromises()
                wrapper.update()
                assertError(wrapper)
              })
            })
          })
        })
      })

      describe('when upload failed - v4 APIs', () => {
        if (process.env.USE_V4_APIS_FOR_DOC_VIDEO !== 'true') {
          return
        }

        beforeEach(() => {
          mockedUploadBinaryMedia.mockRejectedValue(fakeAccessDeniedError)
          simulateButtonClick(wrapper)
        })

        it('renders REQUEST_ERROR error correctly', async () => {
          await runAllPromises()
          wrapper.update()
          assertError(wrapper, false)
        })
      })
    })
  })
})
