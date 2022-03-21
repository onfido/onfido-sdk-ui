import { h } from 'preact'
import { mount, ReactWrapper } from 'enzyme'

import MockedLocalised from '~jest/MockedLocalised'
import MockedReduxProvider, {
  mockedReduxProps,
} from '~jest/MockedReduxProvider'
import {
  formatError,
  sendMultiframeSelfie,
  uploadDocument,
  uploadFaceVideo,
} from '~utils/onfidoApi'
import Confirm, { ConfirmProps } from '../Confirm'

import type { ApiRawError } from '~types/api'
import { CaptureMethods } from '~types/commons'
import { RequestedVariant } from '~types/steps'
import { CapturePayload, DocumentCapture, FaceCapture } from '~types/redux'
import { StepComponentBaseProps } from '~types/routers'
import Welcome from '../../Welcome'
import { WithLocalisedProps } from '~types/hocs'
import { EnterpriseCallbackResponse } from '~types/enterprise'

jest.mock('~utils')
jest.mock('~utils/objectUrl')
jest.mock('~utils/onfidoApi')

const defaultStepComponentBaseProps: StepComponentBaseProps = {
  ...mockedReduxProps,
  steps: [{ type: 'welcome' }, { type: 'document' }],
  allowCrossDeviceFlow: true,
  back: jest.fn(),
  changeFlowTo: jest.fn(),
  componentsList: [
    { component: Welcome, step: { type: 'welcome' }, stepIndex: 0 },
  ],
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  triggerOnError: jest.fn(),
  resetSdkFocus: jest.fn(),
  trackScreen: jest.fn(),
  step: 0,
}

const defaultLocalisedProps: WithLocalisedProps = {
  parseTranslatedTags: jest.fn(),
  language: 'en_US',
  translate: jest.fn(),
}

const defaultCapture: CapturePayload = {
  blob: new Blob(),
  sdkMetadata: {},
  challengeData: {
    id: '',
    challenges: [],
  },
}

const defaultFaceCapture: FaceCapture = {
  ...defaultCapture,
  id: 'fakeFaceCaptureId',
  snapshot: { filename: '', blob: new Blob() },
}

const defaultDocumentCapture: DocumentCapture = {
  ...defaultCapture,
  id: 'fakeDocumentCaptureId',
  documentType: 'passport',
}

type MockedConfirmType = {
  method: CaptureMethods
  mockVariant: 'success' | 'error' | 'continue'
  variant: RequestedVariant
}

const ENTERPRISE_CALLBACKS_BY_VARIANT: Record<
  'success' | 'error' | 'continue',
  Record<
    'onSubmitDocument' | 'onSubmitSelfie' | 'onSubmitVideo',
    (data: FormData) => Promise<EnterpriseCallbackResponse>
  >
> = {
  success: {
    //@ts-ignore
    onSubmitDocument: () => onfidoSuccessResponse,
    //@ts-ignore
    onSubmitSelfie: () => onfidoSuccessResponse,
    //@ts-ignore
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

const MockedConfirm = ({ method, mockVariant, variant }: MockedConfirmType) => {
  const props: ConfirmProps = {
    ...defaultStepComponentBaseProps,
    ...defaultLocalisedProps,
    actions: mockedReduxProps.actions,
    isFullScreen: false,
    side: 'back',
    country: '',
    error: '',
    isDecoupledFromAPI: true,
    method,
    capture: {
      variant,
      ...(method === 'face' ? defaultFaceCapture : defaultDocumentCapture),
    },
    enterpriseFeatures: ENTERPRISE_CALLBACKS_BY_VARIANT[mockVariant],
    token: 'fake_token',
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

const UPLOAD_TYPES: Array<{
  type: string
  method: CaptureMethods
  variant: RequestedVariant
  uploadFunction:
    | typeof uploadDocument
    | typeof sendMultiframeSelfie
    | typeof uploadFaceVideo
}> = [
  {
    type: 'document',
    method: 'document',
    variant: 'standard',
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
    uploadFunction: uploadFaceVideo,
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
              mockedReduxProps.actions,
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
