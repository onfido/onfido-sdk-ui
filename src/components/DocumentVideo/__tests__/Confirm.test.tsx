import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import { fakeDocumentCaptureState } from '~jest/captures'
import {
  fakePassportImageResponse,
  fakeDrivingLicenceFrontResponse,
  fakeDrivingLicenceBackResponse,
  fakePassportVideoResponse,
  fakeNoDocumentError,
} from '~jest/responses'
import { uploadDocument, uploadDocumentVideo } from '~utils/onfidoApi'
import Confirm from '../Confirm'

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

const mockFailedRequest = (wrapper: ReactWrapper) => {
  mockedUploadDocument.mockRejectedValue(fakeNoDocumentError)
  wrapper.find('button.button-primary').simulate('click')
}

const assertUploadError = async (wrapper: ReactWrapper) => {
  expect(wrapper.find('Spinner').exists()).toBeTruthy()
  expect(wrapper.find('.content').exists()).toBeFalsy()
  expect(wrapper.find('button.button-primary').exists()).toBeFalsy()
  expect(wrapper.find('button.button-secondary').exists()).toBeFalsy()

  await runAllPromises()
  wrapper.update()
  expect(wrapper.find('Spinner').exists()).toBeFalsy()

  expect(wrapper.find('Error').exists()).toBeTruthy()
  expect(wrapper.find('Error .title').text()).toEqual(
    'doc_confirmation.alert.no_doc_title'
  )
  expect(wrapper.find('Error .instruction').text()).toEqual(
    'doc_confirmation.alert.no_doc_detail'
  )

  expect(wrapper.find('.content').exists()).toBeFalsy()
  expect(wrapper.find('button.button-primary').exists()).toBeTruthy()
  expect(wrapper.find('button.button-secondary').exists()).toBeTruthy()
}

describe('DocumentVideo', () => {
  describe('Confirm', () => {
    let wrapper: ReactWrapper

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
    })

    it('renders UIs correctly', () => {
      expect(wrapper.find('Spinner').exists()).toBeFalsy()
      expect(wrapper.find('Error').exists()).toBeFalsy()

      expect(wrapper.find('.content').exists()).toBeTruthy()
      expect(wrapper.find('.content > .icon').exists()).toBeTruthy()
      expect(wrapper.find('.content > .title').text()).toEqual(
        'doc_video_confirmation.title'
      )
      expect(wrapper.find('.content > .body').text()).toEqual(
        'doc_video_confirmation.body'
      )

      const uploadButton = wrapper.find('button.button-primary')
      expect(uploadButton.exists()).toBeTruthy()
      expect(uploadButton.text()).toEqual(
        'doc_video_confirmation.button_upload'
      )
      expect(uploadButton.hasClass('button-lg button-centered')).toBeTruthy()

      const redoButton = wrapper.find('button.button-secondary')
      expect(redoButton.exists()).toBeTruthy()
      expect(redoButton.text()).toEqual('doc_video_confirmation.button_redo')
      expect(redoButton.hasClass('button-lg button-centered')).toBeTruthy()
    })

    it('goes back when click on redo', () => {
      wrapper.find('button.button-secondary').simulate('click')
      expect(defaultProps.previousStep).toHaveBeenCalled()
    })

    describe('when upload passport', () => {
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

      describe('when success', () => {
        beforeEach(() => {
          mockedUploadDocument.mockResolvedValue(fakePassportImageResponse)
          mockedUploadDocumentVideo.mockResolvedValue(fakePassportVideoResponse)
          wrapper.find('button.button-primary').simulate('click')
        })

        it('renders spinner correctly', async () => {
          expect(wrapper.find('Spinner').exists()).toBeTruthy()
          expect(wrapper.find('button.button-primary').exists()).toBeFalsy()
          expect(wrapper.find('button.button-secondary').exists()).toBeFalsy()

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
          expect(defaultProps.nextStep).toHaveBeenCalled()
        })
      })

      describe('when error', () => {
        beforeEach(() => mockFailedRequest(wrapper))
        it('renders spinner correctly', () => assertUploadError(wrapper))
      })
    })

    describe('when upload driving licence', () => {
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

      describe('when success', () => {
        beforeEach(() => {
          mockedUploadDocument.mockResolvedValueOnce(
            fakeDrivingLicenceFrontResponse
          )
          mockedUploadDocument.mockResolvedValue(fakeDrivingLicenceBackResponse)
          mockedUploadDocumentVideo.mockResolvedValue(fakePassportVideoResponse)
          wrapper.find('button.button-primary').simulate('click')
        })

        it('renders spinner correctly', async () => {
          expect(wrapper.find('Spinner').exists()).toBeTruthy()
          expect(wrapper.find('button.button-primary').exists()).toBeFalsy()
          expect(wrapper.find('button.button-secondary').exists()).toBeFalsy()

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
              sdkMetadata: fakeVideoPayload.sdkMetadata,
            },
            fakeUrl,
            fakeToken
          )

          expect(mockedUploadDocument).toHaveBeenCalledTimes(2)
          expect(defaultProps.nextStep).toHaveBeenCalled()
        })
      })

      describe('when error', () => {
        beforeEach(() => mockFailedRequest(wrapper))
        it('renders spinner correctly', () => assertUploadError(wrapper))
      })
    })
  })
})
