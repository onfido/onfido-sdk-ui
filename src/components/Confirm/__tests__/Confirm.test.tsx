import { h } from 'preact'
import { FunctionComponent } from 'react'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import {
  uploadDocument,
  uploadLiveVideo,
  sendMultiframeSelfie,
  formatError,
} from '~utils/onfidoApi'
import Confirm from '../Confirm'

import type { ApiRawError } from '~types/api'

jest.mock('~utils')
jest.mock('~utils/objectUrl')
jest.mock('~utils/onfidoApi')

const defaultProps = {
  urls: {
    onfido_api_url: '',
  },
  capture: {
    challengeData: {
      challenges: '',
      id: '',
      switchSeconds: 0,
    },
    snapshot: new Blob(),
  },
  isDecoupledFromAPI: true,
  resetSdkFocus: jest.fn(),
  actions: {
    ...mockedReduxProps.actions,
  },
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
    onSubmitDocument: () => Promise.reject(onfidoRawError),
    onSubmitSelfie: () => Promise.reject(onfidoRawError),
    onSubmitVideo: () => Promise.reject(onfidoRawError),
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

const onfidoRawError: ApiRawError = {
  status: 422,
  response: JSON.stringify({
    error: {
      message: 'There was a validation error on this request',
      type: 'validation_error',
      fields: { detect_glare: ['glare found in image'] },
    },
  }),
}
const onfidoSuccessResponse = Promise.resolve({ onfidoSuccessResponse: {} })
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

const mockedFormatError = formatError as jest.MockedFunction<typeof formatError>

describe('Confirm', () => {
  let wrapper: ReactWrapper
  const runAllPromises = () => new Promise(setImmediate)

  describe('onSubmitCallback', () => {
    UPLOAD_TYPES.forEach(({ type, method, variant, uploadFunction }) => {
      describe(`for ${type}`, () => {
        afterEach(() => {
          jest.clearAllMocks()
        })

        describe('when response contains onfidoSuccessResponse', () => {
          beforeEach(() => {
            wrapper = mount(
              <MockedConfirm
                method={method}
                mockVariant="success"
                variant={variant}
              />
            )
          })

          it('does not trigger the SDK to send the request', async () => {
            const spyUpload = jest.spyOn(
              { [uploadFunction.name]: uploadFunction },
              uploadFunction.name
            )
            wrapper
              .find({ 'data-onfido-qa': 'confirm-action-btn' })
              .simulate('click')
            await runAllPromises()

            expect(spyUpload).not.toHaveBeenCalled()
          })

          it('triggers the onApiSuccess method', async () => {
            // Spying on prop setCaptureMetadata called within onApiSuccess because we
            // can't directly spy on onApiSuccess when using arrow function for class property
            const spyOnApiSuccess = jest.spyOn(
              defaultProps.actions,
              'setCaptureMetadata'
            )
            wrapper
              .find({ 'data-onfido-qa': 'confirm-action-btn' })
              .simulate('click')
            await runAllPromises()

            expect(spyOnApiSuccess).toHaveBeenCalledTimes(1)
          })
        })

        describe('when an errorResponse is caught', () => {
          beforeEach(() => {
            wrapper = mount(
              <MockedConfirm
                method={method}
                mockVariant="error"
                variant={variant}
              />
            )
            mockedFormatError.mockImplementation(
              ({ response, status }, onError) =>
                onError({ status, response: JSON.parse(response) })
            )
          })

          it('does not trigger the SDK to send the request', async () => {
            const spyUpload = jest.spyOn(
              { [uploadFunction.name]: uploadFunction },
              uploadFunction.name
            )
            wrapper
              .find({ 'data-onfido-qa': 'confirm-action-btn' })
              .simulate('click')
            await runAllPromises()

            expect(spyUpload).not.toHaveBeenCalled()
          })

          it('correctly updates the state with the error', async () => {
            wrapper
              .find({ 'data-onfido-qa': 'confirm-action-btn' })
              .simulate('click')
            await runAllPromises()
            const errorState = wrapper.find('Confirm').state('error')

            expect(errorState).toEqual({
              name: 'GLARE_DETECTED',
              type: 'error',
            })
          })
        })

        describe('when response contains continueWithOnfidoSubmission: true', () => {
          beforeEach(() => {
            wrapper = mount(
              <MockedConfirm
                method={method}
                mockVariant="continue"
                variant={variant}
              />
            )
          })

          it('triggers the SDK to send the request to Onfido', async () => {
            const spyUpload = jest.spyOn(
              { [uploadFunction.name]: uploadFunction },
              uploadFunction.name
            )
            wrapper
              .find({ 'data-onfido-qa': 'confirm-action-btn' })
              .simulate('click')
            await runAllPromises()

            expect(spyUpload).toHaveBeenCalledTimes(1)
          })
        })
      })
    })
  })
})
