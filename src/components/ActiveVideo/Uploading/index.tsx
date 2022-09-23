import { h, FunctionComponent, ComponentType } from 'preact'
import { useCallback, useEffect } from 'preact/hooks'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { Wrapper } from '../Wrapper'
import { BaseScreen } from '../BaseScreen'
import { LoaderIcon } from '../assets/LoaderIcon'
import { localised } from '~locales'
import { connect } from 'react-redux'
import { ActiveVideoCapture, RootState } from '~types/redux'
import { buildCaptureStateKey } from '~utils/redux'
import { ErrorProp, StepComponentProps } from '~types/routers'
import { uploadActiveVideo } from '~utils/onfidoApi'
import { ActiveVideoResponse, ParsedError } from '~types/api'
import { ErrorNames } from '~types/commons'
import { trackException, trackComponent } from 'Tracker'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'

type Props = StepComponentProps &
  WithLocalisedProps &
  WithTrackingProps & {
    capture?: ActiveVideoCapture
  }

const mapStateToProps = ({ captures }: RootState, props: Props): Props => ({
  ...props,
  capture: captures[
    buildCaptureStateKey({ method: 'activeVideo' })
  ] as ActiveVideoCapture,
})

const Uploading: FunctionComponent<Props> = ({
  nextStep,
  completeStep,
  triggerOnError,
  resetSdkFocus,
  mobileFlow,
  crossDeviceClientError,
  token,
  actions,
  capture,
  urls,
  trackScreen,
  translate,
}) => {
  const setError = useCallback(
    (name: ErrorNames, errorMessage?: unknown) => {
      const error: ErrorProp = { name, type: 'error' }
      if (errorMessage) {
        error.properties = { error_message: errorMessage }
      }

      resetSdkFocus()
    },
    [resetSdkFocus]
  )

  const onApiSuccess = useCallback(
    (apiResponse: ActiveVideoResponse) => {
      actions.setCaptureMetadata({ capture, apiResponse })
      completeStep([{ id: apiResponse.id }])
      trackScreen('upload_completed')
      nextStep()
    },
    [actions, capture, completeStep, nextStep, trackScreen]
  )

  const onApiError = useCallback(
    (error: ParsedError) => {
      const status = error.status || 0
      const response = error.response || {}

      if (mobileFlow && status === 401) {
        triggerOnError({ status, response })
        if (crossDeviceClientError) {
          crossDeviceClientError()
        }
      } else if (status === 422) {
        setError('REQUEST_ERROR')
      } else if (
        status === 403 &&
        response.error?.type === 'geoblocked_request'
      ) {
        setError(
          'GEOBLOCKED_ERROR',
          'generic.errors.geoblocked_error.instruction'
        )
      } else {
        triggerOnError({ status, response })
        trackException(`${status} - ${response}`)
        setError('REQUEST_ERROR', response?.error?.message)
      }
    },
    [crossDeviceClientError, mobileFlow, setError, triggerOnError]
  )

  useEffect(() => {
    if (!capture) return

    const metadata = {
      sdk_metadata: capture.sdkMetadata,
      sdk_source: process.env.SDK_SOURCE,
      sdk_version: process.env.SDK_VERSION,
    }

    uploadActiveVideo(
      capture.blob,
      JSON.stringify(metadata),
      urls.onfido_api_url,
      token,
      onApiSuccess,
      onApiError
    )
  }, [capture, onApiError, onApiSuccess, token, urls.onfido_api_url])

  return (
    <BaseScreen>
      <Wrapper>
        <Header title={translate('avc_uploading.title')}>
          <LoaderIcon />
        </Header>
      </Wrapper>

      <Footer />
    </BaseScreen>
  )
}

// Note: Preact and Redux types don't play nice together, hence the type cast.
export default (connect(mapStateToProps)(
  trackComponent(localised(Uploading), 'upload') as FunctionComponent<Props>
) as unknown) as ComponentType<StepComponentProps>
