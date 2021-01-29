import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import { fakeDocumentCaptureState } from '~jest/captures'
import { uploadDocument } from '~utils/onfidoApi'
import Confirm, { Props as ConfirmProps } from '../Confirm'

jest.mock('../../utils/onfidoApi')

const defaultProps: ConfirmProps = {
  allowCrossDeviceFlow: true,
  componentsList: [],
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  nextStep: jest.fn(),
  onRedo: jest.fn(),
  previousStep: jest.fn(),
  resetSdkFocus: jest.fn(),
  step: 0,
  stepIndexType: 'user',
  trackScreen: jest.fn(),
  triggerOnError: jest.fn(),
  ...mockedReduxProps,
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

    it('renders buttons correctly', () => {
      expect(wrapper.find('Spinner').exists()).toBeFalsy()

      const uploadButton = wrapper.find('button.button-primary')
      expect(uploadButton.exists()).toBeTruthy()
      expect(uploadButton.text()).toEqual(
        'doc_confirmation.button_primary_upload'
      )
      expect(uploadButton.hasClass('button-lg button-centered')).toBeTruthy()

      const redoButton = wrapper.find('button.button-secondary')
      expect(redoButton.exists()).toBeTruthy()
      expect(redoButton.text()).toEqual('doc_confirmation.button_primary_redo')
      expect(redoButton.hasClass('button-lg button-centered')).toBeTruthy()
    })

    it('goes back when click on redo', () => {
      wrapper.find('button.button-secondary').simulate('click')
      expect(defaultProps.onRedo).toHaveBeenCalled()
    })

    describe('when upload', () => {
      const mockedUploadDocument = uploadDocument as jest.MockedFunction<
        typeof uploadDocument
      >

      const fakeDocumentType = 'passport'
      const fakeCapturePayload = fakeDocumentCaptureState(
        fakeDocumentType,
        'standard'
      )
      const fakeUrl = 'https://fake-api.onfido.com'
      const fakeToken = 'fake-sdk-token'

      beforeEach(() => {
        wrapper = mount(
          <MockedReduxProvider
            overrideCaptures={{
              document_front: fakeCapturePayload,
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
          mockedUploadDocument.mockImplementation(
            (_payload, _url, _token, onSuccess) =>
              setTimeout(() => onSuccess({ valid: true }), 0)
          )

          wrapper.find('button.button-primary').simulate('click')
        })

        it('renders spinner correctly', () => {
          expect(wrapper.find('Spinner').exists()).toBeTruthy()
          expect(wrapper.find('button.button-primary').exists()).toBeFalsy()
          expect(wrapper.find('button.button-secondary').exists()).toBeFalsy()

          expect(mockedUploadDocument).toHaveBeenCalled()
          const [data, url, token] = mockedUploadDocument.mock.calls[0]
          expect(data).toMatchObject({
            file: new Blob([]),
            sdkMetadata: fakeCapturePayload.sdkMetadata,
            side: 'front',
            type: 'passport',
          })
          expect(url).toEqual(fakeUrl)
          expect(token).toEqual(fakeToken)

          jest.runAllTimers()
          // @TODO: navigate to the next screen
        })
      })

      describe('when error', () => {
        beforeEach(() => {
          mockedUploadDocument.mockImplementation(
            (_payload, _url, _token, _onSuccess, onError) =>
              setTimeout(
                () =>
                  onError({
                    response: { message: 'Fake error message' },
                    status: 422,
                  }),
                0
              )
          )

          wrapper.find('button.button-primary').simulate('click')
        })

        it('renders spinner correctly', () => {
          expect(wrapper.find('Spinner').exists()).toBeTruthy()
          expect(wrapper.find('button.button-primary').exists()).toBeFalsy()
          expect(wrapper.find('button.button-secondary').exists()).toBeFalsy()

          // console.log(mockedUploadDocument.mock.calls)
          jest.runAllTimers()
          expect(wrapper.find('Spinner').exists()).toBeTruthy()
          expect(wrapper.find('button.button-primary').exists()).toBeFalsy()
          expect(wrapper.find('button.button-secondary').exists()).toBeFalsy()
        })
      })
    })
  })
})
