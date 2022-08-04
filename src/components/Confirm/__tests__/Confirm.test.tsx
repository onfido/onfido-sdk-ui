import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'
import { h } from 'preact'

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
import { SdkConfigurationServiceContext } from '~contexts/useSdkConfigurationService'

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
  completeStep: jest.fn(),
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
  imageQualityRetries?: number
  maxDocumentCaptureRetries?: number
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
const defaultConfirmProps: ConfirmProps = {
  ...defaultStepComponentBaseProps,
  ...defaultLocalisedProps,
  actions: mockedReduxProps.actions,
  isFullScreen: false,
  side: 'back',
  country: '',
  error: '',
  isDecoupledFromAPI: true,
  method: 'document',
  capture: {
    variant: 'standard',
    ...defaultDocumentCapture,
  },
  token: 'fake_token',
  imageQualityRetries: 0,
}

const MockedConfirm = ({
  method,
  mockVariant,
  variant,
  imageQualityRetries,
  maxDocumentCaptureRetries,
}: MockedConfirmType) => {
  const props: ConfirmProps = {
    ...defaultConfirmProps,
    method,
    capture: {
      variant,
      ...(method === 'face' ? defaultFaceCapture : defaultDocumentCapture),
    },
    enterpriseFeatures: ENTERPRISE_CALLBACKS_BY_VARIANT[mockVariant],
    imageQualityRetries: imageQualityRetries ?? 0,
  }

  return (
    <MockedReduxProvider>
      <MockedLocalised>
        <SdkConfigurationServiceContext.Provider
          value={{
            document_capture: {
              max_total_retries: maxDocumentCaptureRetries ?? 1,
            },
          }}
        >
          <Confirm {...props} />
        </SdkConfigurationServiceContext.Provider>
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

/**
 * Ensures that the callable expression does not happen. see https://stackoverflow.com/a/68400490
 * @param callable
 */
async function expectNever(callable: () => unknown): Promise<void> {
  // the callable expression should never happen, otherwise the test will fail.
  await expect(() => waitFor(callable)).rejects.toEqual(expect.anything())
}

describe('Confirm', () => {
  describe('onSubmitCallback', () => {
    UPLOAD_TYPES.forEach(({ type, method, variant, uploadFunction }) => {
      describe(`for ${type}`, () => {
        afterEach(() => {
          jest.clearAllMocks()
        })

        describe('when response contains onfidoSuccessResponse', () => {
          beforeEach(() => {
            render(
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

            const confirm = screen.getByText(
              'doc_confirmation.button_primary_upload'
            )

            userEvent.click(confirm)

            await expectNever(() =>
              // this should never happen, otherwise the test will fail.
              expect(spyUpload).toHaveBeenCalled()
            )
          })

          it('triggers the onApiSuccess method', async () => {
            // Spying on prop setCaptureMetadata called within onApiSuccess because we
            // can't directly spy on onApiSuccess when using arrow function for class property
            const spyOnApiSuccess = jest.spyOn(
              mockedReduxProps.actions,
              'setCaptureMetadata'
            )

            const confirm = screen.getByText(
              'doc_confirmation.button_primary_upload'
            )

            userEvent.click(confirm)

            await waitFor(
              () => expect(spyOnApiSuccess).toHaveBeenCalledTimes(1),
              {
                timeout: 2000,
              }
            )
          })
        })

        describe('when an errorResponse is caught', () => {
          beforeEach(() => {
            render(
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

            const confirm = screen.getByText(
              'doc_confirmation.button_primary_upload'
            )

            userEvent.click(confirm)

            await expectNever(() =>
              // this should never happen, otherwise the test will fail.
              expect(spyUpload).toHaveBeenCalled()
            )
          })
        })
      })

      describe('when response contains continueWithOnfidoSubmission: true', () => {
        beforeEach(() => {
          render(
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
          const confirm = screen.getByText(
            'doc_confirmation.button_primary_upload'
          )

          userEvent.click(confirm)

          await waitFor(() => expect(spyUpload).toHaveBeenCalledTimes(1))
        })
      })
    })
  })
})
// add a specific test for document capture only, as it's the only one that uses a retry for image quality.
describe('document capture', () => {
  describe('when an image quality detection issue is detected in the backend', () => {
    beforeEach(() => {
      mockedFormatError.mockImplementation(({ response, status }, onError) =>
        onError({ status, response: JSON.parse(response) })
      )
    })

    const errorImageQualityRetries = [0, 1]
    errorImageQualityRetries.forEach((imageQualityRetry) => {
      describe(`when imageQualityRetry (${imageQualityRetry}) <= max_total_retries (1)`, () => {
        beforeEach(() => {
          render(
            <MockedConfirm
              method={'document'}
              mockVariant="continue"
              variant={'standard'}
              imageQualityRetries={imageQualityRetry}
              maxDocumentCaptureRetries={1}
            />
          )
        })

        it('should call the backend with the validations as errors', async () => {
          const spyUpload = jest.spyOn(
            { [uploadDocument.name]: uploadDocument },
            uploadDocument.name
          )

          const confirm = screen.getByText(
            'doc_confirmation.button_primary_upload'
          )

          userEvent.click(confirm)

          await waitFor(() => expect(spyUpload).toHaveBeenCalledTimes(1))

          expect(spyUpload).toBeCalledWith(
            expect.objectContaining({
              validations: {
                detect_blur: 'error',
                detect_cutoff: 'error',
                detect_document: 'error',
                detect_glare: 'error',
              },
            }),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            undefined
          )
        })
      })
    })

    const imageQualityWarnings = [2, 3] // can be up to infinity
    imageQualityWarnings.forEach((imageQualityRetry) => {
      afterEach(() => {
        jest.clearAllMocks()
      })

      describe(`for imageQualityRetry (${imageQualityRetry}) > max_total_retries (1)`, () => {
        beforeEach(() => {
          render(
            <MockedConfirm
              method={'document'}
              mockVariant="continue"
              variant={'standard'}
              imageQualityRetries={imageQualityRetry}
              maxDocumentCaptureRetries={1}
            />
          )
        })

        it('should call the backend with the validations as warnings, plus the document validation as error.', async () => {
          const spyUpload = jest.spyOn(
            { [uploadDocument.name]: uploadDocument },
            uploadDocument.name
          )

          const confirm = screen.getByText(
            'doc_confirmation.button_primary_upload'
          )

          userEvent.click(confirm)

          await waitFor(() => expect(spyUpload).toHaveBeenCalledTimes(1))

          expect(spyUpload).toBeCalledWith(
            expect.objectContaining({
              validations: {
                detect_blur: 'warn',
                detect_cutoff: 'warn',
                detect_document: 'error', // this one is always error
                detect_glare: 'warn',
              },
            }),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
            undefined
          )
        })
      })
    })
  })

  describe('when a geoblocked error happens', () => {
    beforeEach(() => {
      mockedFormatError.mockImplementation(({ response, status }, onError) =>
        onError({ status, response: JSON.parse(response) })
      )

      const geoblockedRawError: ApiRawError = {
        status: 403,
        response: JSON.stringify({
          error: {
            message:
              'Cannot process api requests from this country. The api request will be blocked.',
            type: 'geoblocked_request',
            fields: {},
          },
        }),
      }

      const mockedConfirm = (
        <MockedReduxProvider>
          <MockedLocalised>
            <SdkConfigurationServiceContext.Provider
              value={{
                document_capture: {
                  max_total_retries: 1,
                },
              }}
            >
              <Confirm
                {...defaultConfirmProps}
                enterpriseFeatures={{
                  onSubmitDocument: () => Promise.reject(geoblockedRawError),
                }}
              />
            </SdkConfigurationServiceContext.Provider>
          </MockedLocalised>
        </MockedReduxProvider>
      )

      render(mockedConfirm)
    })

    it('Should display a geoblocked error with its instructions.', async () => {
      const confirm = screen.getByText('doc_confirmation.button_primary_upload')

      userEvent.click(confirm)

      await waitFor(() =>
        screen.getByText('generic.errors.geoblocked_error.message')
      )

      await waitFor(() =>
        screen.getByText('generic.errors.geoblocked_error.instruction')
      )
    })
  })
})
