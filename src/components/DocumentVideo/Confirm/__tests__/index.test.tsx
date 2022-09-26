import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import { SdkOptionsProvider } from '~contexts/useSdkOptions'
import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
  MockedStore,
} from '~jest/MockedReduxProvider'
import { fakeDocumentCaptureState } from '~jest/captures'
import {
  fakeCreateV4DocumentResponse,
  fakeAccessDeniedError,
} from '~jest/responses'
import { uploadBinaryMedia, createV4Document } from '~utils/onfidoApi'
import Confirm from '../index'

import type { NarrowSdkOptions } from '~types/commons'
import type { StepComponentDocumentProps } from '~types/routers'

jest.mock('~utils/objectUrl')
jest.mock('~utils/onfidoApi')

const fakeUrl = 'https://fake-api.onfido.com'
const fakeToken = 'fake-sdk-token'

const mockedUploadBinaryMedia = uploadBinaryMedia as jest.MockedFunction<
  typeof uploadBinaryMedia
>
const mockedCreateV4Document = createV4Document as jest.MockedFunction<
  typeof createV4Document
>

const runAllPromises = () => new Promise(setImmediate)

const defaultOptions: NarrowSdkOptions = {
  steps: [{ type: 'welcome' }, { type: 'document' }],
  token: fakeToken,
}

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
  steps: [{ type: 'document' }],
  trackScreen: jest.fn(),
  triggerOnError: jest.fn(),
  completeStep: jest.fn(),
  ...mockedReduxProps,
}

type ButtonVariants = 'primary' | 'secondary'

const findButton = (wrapper: ReactWrapper, buttonVariant: ButtonVariants) =>
  wrapper.find({
    'data-onfido-qa': `doc-video-confirm-${buttonVariant}-btn`,
  })

const simulateButtonClick = (
  wrapper: ReactWrapper,
  buttonVariant: ButtonVariants
) => findButton(wrapper, buttonVariant).simulate('click')

const assertButton = (
  wrapper: ReactWrapper,
  buttonVariant: ButtonVariants,
  buttonFunction: 'upload' | 'preview' | 'redo'
) => {
  const button = findButton(wrapper, buttonVariant)
  expect(button.exists()).toBeTruthy()
  expect(button.hasClass('button-centered button-lg')).toBeTruthy()

  switch (buttonFunction) {
    case 'upload':
      expect(button.text()).toEqual('video_confirmation.button_primary')
      break

    case 'preview':
      expect(button.text()).toEqual('doc_video_confirmation.button_secondary')
      break

    case 'redo':
      expect(button.text()).toEqual('video_confirmation.button_secondary')
      break

    default:
      break
  }
}

const assertError = (wrapper: ReactWrapper, noDoc = false) => {
  expect(wrapper.find('.content').exists()).toBeFalsy()
  expect(wrapper.find('.preview').exists()).toBeFalsy()
  expect(findButton(wrapper, 'primary')).toBeTruthy()

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

  assertButton(wrapper, 'secondary', 'redo')
  simulateButtonClick(wrapper, 'secondary')
  expect(defaultProps.previousStep).toHaveBeenCalled()
}

const assertContent = (
  wrapper: ReactWrapper,
  variant: 'default' | 'preview'
) => {
  expect(wrapper.find('Spinner').exists()).toBeFalsy()
  expect(wrapper.find('Error').exists()).toBeFalsy()
  expect(
    wrapper.find({ 'data-onfido-qa': 'doc-video-confirm-primary-btn' }).exists()
  ).toBeTruthy()
  expect(
    wrapper
      .find({ 'data-onfido-qa': 'doc-video-confirm-secondary-btn' })
      .exists()
  ).toBeTruthy()

  if (variant === 'preview') {
    expect(wrapper.find('.content').exists()).toBeFalsy()

    expect(wrapper.find('.preview').exists()).toBeTruthy()
    expect(wrapper.find('.preview > .title').text()).toEqual(
      'doc_video_confirmation.title'
    )
    expect(wrapper.find('.preview > CaptureViewer').exists()).toBeTruthy()
    return
  }

  // Default
  expect(wrapper.find('.content').exists()).toBeTruthy()
  expect(wrapper.find('.content > .icon').exists()).toBeTruthy()
  expect(wrapper.find('.content > .title').text()).toEqual('outro.body')
  expect(wrapper.find('.content > .body').text()).toEqual(
    'video_confirmation.body'
  )
  expect(wrapper.find('.preview').exists()).toBeFalsy()
}

const assertSpinner = (wrapper: ReactWrapper) => {
  expect(wrapper.find('Spinner').exists()).toBeTruthy()
  expect(wrapper.find('.content').exists()).toBeFalsy()
  expect(wrapper.find('CaptureViewer').exists()).toBeFalsy()
  expect(findButton(wrapper, 'primary').exists()).toBeFalsy()
  expect(findButton(wrapper, 'secondary').exists()).toBeFalsy()
}

describe('DocumentVideo', () => {
  describe('Confirm', () => {
    let wrapper: ReactWrapper
    let mockedStore: MockedStore

    beforeEach(() => {
      jest.useFakeTimers()
      const fakeVideoPayload = fakeDocumentCaptureState('passport', 'video')

      wrapper = mount(
        <MockedReduxProvider
          overrideCaptures={{
            document_video: fakeVideoPayload,
          }}
        >
          <SdkOptionsProvider options={defaultOptions}>
            <MockedLocalised>
              <Confirm {...defaultProps} />
            </MockedLocalised>
          </SdkOptionsProvider>
        </MockedReduxProvider>
      )
    })

    afterEach(() => {
      jest.clearAllMocks()
      mockedStore && mockedStore.clearActions()
    })

    it('renders items correctly', () => {
      assertContent(wrapper, 'default')
      assertButton(wrapper, 'primary', 'upload')
      assertButton(wrapper, 'secondary', 'preview')
    })

    describe('with missing captures', () => {
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

      const possibleCases = [
        {
          missingCapture: 'front',
          captures: {
            document_video: fakeVideoPayload,
          },
          message: 'Front of document not captured',
        },
        {
          missingCapture: 'video',
          captures: {
            document_front: fakeFrontPayload,
          },
          message: 'Document video not captured',
        },
      ]

      beforeEach(() => {
        console.error = jest.fn()
      })

      possibleCases.forEach(({ missingCapture, captures, message }) => {
        it(`raises error and stop submitting with missing ${missingCapture}`, () => {
          wrapper = mount(
            <MockedReduxProvider
              overrideCaptures={captures}
              overrideGlobals={{
                urls: {
                  onfido_api_url: fakeUrl,
                },
              }}
              storeRef={(store) => (mockedStore = store)}
            >
              <SdkOptionsProvider options={defaultOptions}>
                <MockedLocalised>
                  <Confirm {...defaultProps} />
                </MockedLocalised>
              </SdkOptionsProvider>
            </MockedReduxProvider>
          )
          simulateButtonClick(wrapper, 'primary')

          expect(console.error).toHaveBeenCalledWith(message)
          expect(defaultProps.previousStep).toHaveBeenCalled()
        })
      })
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
            <SdkOptionsProvider options={defaultOptions}>
              <MockedLocalised>
                <Confirm {...defaultProps} />
              </MockedLocalised>
            </SdkOptionsProvider>
          </MockedReduxProvider>
        )
      })

      it('shows capture viewer when click on preview', () => {
        simulateButtonClick(wrapper, 'secondary')
        assertContent(wrapper, 'preview')
        assertButton(wrapper, 'secondary', 'redo')
      })

      it('goes back when click on redo', () => {
        simulateButtonClick(wrapper, 'secondary') // Preview
        simulateButtonClick(wrapper, 'secondary') // Redo
        expect(defaultProps.previousStep).toHaveBeenCalled()
      })

      describe('when upload success', () => {
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
          simulateButtonClick(wrapper, 'primary')
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
            <SdkOptionsProvider options={defaultOptions}>
              <MockedLocalised>
                <Confirm {...defaultProps} />
              </MockedLocalised>
            </SdkOptionsProvider>
          </MockedReduxProvider>
        )
      })

      it('shows capture viewer when click on preview', () => {
        simulateButtonClick(wrapper, 'secondary')
        assertContent(wrapper, 'preview')
        assertButton(wrapper, 'secondary', 'redo')
      })

      it('goes back when click on redo', () => {
        simulateButtonClick(wrapper, 'secondary') // Preview
        simulateButtonClick(wrapper, 'secondary') // Redo
        expect(defaultProps.previousStep).toHaveBeenCalled()
      })

      describe('when upload success', () => {
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
          simulateButtonClick(wrapper, 'primary')
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

      describe('when upload failed', () => {
        beforeEach(() => {
          mockedUploadBinaryMedia.mockRejectedValue(fakeAccessDeniedError)
          simulateButtonClick(wrapper, 'primary')
        })

        it('renders REQUEST_ERROR error correctly', async () => {
          await runAllPromises()
          wrapper.update()
          assertError(wrapper, false)
          expect(defaultProps.triggerOnError).toHaveBeenCalledWith(
            fakeAccessDeniedError
          )
        })
      })
    })
  })
})
