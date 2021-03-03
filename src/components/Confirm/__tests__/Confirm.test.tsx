import { h } from 'preact'
import { mount } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider from '~jest/MockedReduxProvider'
import {
  uploadDocument,
  uploadLiveVideo,
  sendMultiframeSelfie,
} from '~utils/onfidoApi'
import Confirm from '../Confirm'

jest.mock('../../utils')
jest.mock('../../utils/objectUrl')
jest.mock('../../utils/onfidoApi')

const defaultProps = {
  urls: {
    onfido_api_url: '',
  },
  capture: {
    blob: new Blob(),
    documentType: '',
    variant: '',
    challengeData: {
      challenges: '',
      id: '',
      switchSeconds: 0,
    },
    language: '',
    sdkMetadata: '',
    snapshot: new Blob(),
  },
  method: 'document',
  side: '',
  token: '',
  poaDocumentType: '',
  language: '',
  imageQualityRetries: 0,
  isDecoupledFromAPI: true,
  enterpriseFeatures: {},
  triggerOnError: jest.fn(),
  resetSdkFocus: jest.fn(),
  actions: {
    resetImageQualityRetries: jest.fn(),
    setCaptureMetadata: jest.fn(),
  },
  nextStep: jest.fn(),
}
type MockedConfirmType = {
  method: string
  mockVariant: 'success' | 'error' | 'continue'
  variant: string
}

const ENTERPRISE_CALLBACKS_BY_VARIANT: Record<
  'success' | 'error' | 'continue',
  unknown
> = {
  success: {
    onSubmitDocument: () => onfidoSuccessResponse,
    onSubmitSelfie: () => onfidoSuccessResponse,
    onSubmitVideo: () => onfidoSuccessResponse,
  },
  error: {
    onSubmitDocument: () => onfidoErrorResponse,
    onSubmitSelfie: () => onfidoErrorResponse,
    onSubmitVideo: () => onfidoErrorResponse,
  },
  continue: {
    onSubmitDocument: () => continueWithOnfidoSubmission,
    onSubmitSelfie: () => continueWithOnfidoSubmission,
    onSubmitVideo: () => continueWithOnfidoSubmission,
  },
}

const MockedConfirm: FunctionComponent<MockedConfirmType> = ({
  method,
  mockVariant,
  variant,
}) => {
  const props = {
    ...defaultProps,
    method,
    capture: { ...defaultProps.capture, variant },
    enterpriseFeatures: ENTERPRISE_CALLBACKS_BY_VARIANT[mockVariant],
  }

  return (
    <MockedReduxProvider>
      <MockedLocalised>
        <Confirm {...props} />
      </MockedLocalised>
    </MockedReduxProvider>
  )
}

const onfidoSuccessResponse = Promise.resolve({ onfidoSuccessResponse: {} })
const onfidoErrorResponse = Promise.reject({
  status: 422,
  response: JSON.stringify({
    error: {
      message: 'There was a validation error on this request',
      type: 'validation_error',
      fields: { detect_glare: ['glare found in image'] },
    },
  }),
})
const continueWithOnfidoSubmission = Promise.resolve({
  continueWithOnfidoSubmission: true,
})

const UPLOAD_TYPES = [
  {
    type: 'document',
    method: 'document',
    variant: '',
    uploadFunction: uploadDocument,
  },
  {
    type: 'selfie',
    method: 'face',
    variant: 'standard',
    uploadFunction: sendMultiframeSelfie,
  },
  {
    type: 'video',
    method: 'face',
    variant: 'video',
    uploadFunction: uploadLiveVideo,
  },
]

describe('Confirm', () => {
  describe('onSubmitCallback', () => {
    UPLOAD_TYPES.forEach(({ type, method, variant, uploadFunction }) => {
      describe(`for ${type}`, () => {
        afterEach(() => {
          jest.clearAllMocks()
          props = defaultProps
        })

        describe('when response contains onfidoSuccessResponse', () => {
          beforeEach(() => {
            props = {
              ...defaultProps,
              method,
              capture: { ...defaultProps.capture, variant },
              enterpriseFeatures: {
                onSubmitDocument: () => onfidoSuccessResponse,
                onSubmitSelfie: () => onfidoSuccessResponse,
                onSubmitVideo: () => onfidoSuccessResponse,
              },
            }
          })

          it('does not trigger the SDK to send the request', async () => {
            const spyUpload = jest.spyOn(
              { [uploadFunction.name]: uploadFunction },
              uploadFunction.name
            )
            const wrapper = mount(
              <MockedReduxProvider>
                <MockedLocalised>
                  <Confirm {...props} />
                </MockedLocalised>
              </MockedReduxProvider>
            )
            wrapper.find('.button-primary').simulate('click')

            expect(spyUpload).not.toHaveBeenCalled()
          })

          it('triggers the onApiSuccess method', async () => {
            // Spying on prop setCaptureMetadata called within onApiSuccess because we
            // can't directly spy on onApiSuccess when using arrow function for class property
            const spyOnApiSuccess = jest.spyOn(
              props.actions,
              'setCaptureMetadata'
            )
            const wrapper = mount(
              <MockedReduxProvider>
                <MockedLocalised>
                  <Confirm {...props} />,
                </MockedLocalised>
              </MockedReduxProvider>
            )
            await wrapper.find('.button-primary').simulate('click')

            expect(spyOnApiSuccess).toHaveBeenCalledTimes(1)
          })
        })

        describe('when an errorResponse is caught', () => {
          beforeEach(() => {
            props = {
              ...defaultProps,
              method,
              capture: { ...defaultProps.capture, variant },
              enterpriseFeatures: {
                onSubmitDocument: () => onfidoErrorResponse,
                onSubmitSelfie: () => onfidoErrorResponse,
                onSubmitVideo: () => onfidoErrorResponse,
              },
            }
          })

          it('does not trigger the SDK to send the request', async () => {
            const spyUpload = jest.spyOn(
              { [uploadFunction.name]: uploadFunction },
              uploadFunction.name
            )
            const wrapper = mount(
              <MockedReduxProvider>
                <MockedLocalised>
                  <Confirm {...props} />
                </MockedLocalised>
              </MockedReduxProvider>
            )
            await wrapper.find('.button-primary').simulate('click')

            expect(spyUpload).not.toHaveBeenCalled()
          })

          it('correctly updates the state with the error', async () => {
            const wrapper = mount(
              <MockedReduxProvider>
                <MockedLocalised>
                  <Confirm {...props} />
                </MockedLocalised>
              </MockedReduxProvider>
            )
            await wrapper.find('.button-primary').simulate('click')
            wrapper.update()
            const errorState = wrapper.find('Confirm').state('error')

            expect(errorState).toEqual({
              name: 'GLARE_DETECTED',
              type: 'error',
            })
          })
        })

        describe('when response contains continueWithOnfidoSubmission: true', () => {
          beforeEach(() => {
            props = {
              ...defaultProps,
              method,
              capture: { ...defaultProps.capture, variant },
              enterpriseFeatures: {
                onSubmitDocument: () => continueWithOnfidoSubmission,
                onSubmitSelfie: () => continueWithOnfidoSubmission,
                onSubmitVideo: () => continueWithOnfidoSubmission,
              },
            }
          })

          it('triggers the SDK to send the request to Onfido', async () => {
            const spyUpload = jest.spyOn(
              { [uploadFunction.name]: uploadFunction },
              uploadFunction.name
            )
            const wrapper = mount(
              <MockedReduxProvider>
                <MockedLocalised>
                  <Confirm {...props} />
                </MockedLocalised>
              </MockedReduxProvider>
            )
            await wrapper.find('.button-primary').simulate('click')

            expect(spyUpload).toHaveBeenCalledTimes(1)
          })
        })
      })
    })
  })
})
