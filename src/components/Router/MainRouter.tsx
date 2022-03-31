import { h, Component } from 'preact'

import { isDesktop, getUnsupportedMobileBrowserError } from '~utils'
import { buildStepFinder } from '~utils/steps'
import withTheme from '../Theme'
import GenericError from '../GenericError'

import { getWoopraCookie } from '../../Tracker'
import HistoryRouter from './HistoryRouter'

import type { MobileConfig } from '~types/commons'
import type { StepConfig } from '~types/steps'
import type { FlowChangeCallback, InternalRouterProps } from '~types/routers'
import Spinner from '../Spinner'
import { SdkConfigurationServiceProvider } from '~contexts/useSdkConfigurationService'
import { OptionsStepsProvider } from './OptionsStepsProvider'
import { UserConsentProvider } from '~contexts/useUserConsent'

const isUploadFallbackOffAndShouldUseCamera = (step: StepConfig): boolean => {
  if (!step.options || (step.type !== 'document' && step.type !== 'face')) {
    return false
  }

  return (
    step.options?.uploadFallback === false &&
    (step.type === 'face' || step.options?.useLiveDocumentCapture === true)
  )
}

// Wrap components with theme that include navigation and footer
const WrappedError = withTheme(GenericError)

type State = {
  crossDeviceInitialClientStep?: number
  crossDeviceInitialStep?: number
}

export default class MainRouter extends Component<InternalRouterProps, State> {
  generateMobileConfig = (): MobileConfig => {
    const {
      documentType,
      idDocumentIssuingCountry,
      poaDocumentType,
      deviceHasCameraSupport,
      options,
      urls,
      analyticsSessionUuid,
      anonymousUuid,
    } = this.props

    const {
      steps,
      token,
      language,
      disableAnalytics,
      enterpriseFeatures,
      customUI,
      crossDeviceClientIntroProductName,
      crossDeviceClientIntroProductLogoSrc,
    } = options

    const woopraCookie = !disableAnalytics ? getWoopraCookie() : null

    if (!steps) {
      throw new Error('steps not provided')
    }

    const { crossDeviceInitialClientStep, crossDeviceInitialStep } = this.state

    return {
      clientStepIndex: crossDeviceInitialClientStep,
      deviceHasCameraSupport,
      disableAnalytics,
      documentType,
      enterpriseFeatures,
      customUI: customUI || null,
      crossDeviceClientIntroProductName,
      crossDeviceClientIntroProductLogoSrc,
      idDocumentIssuingCountry,
      language,
      poaDocumentType,
      step: crossDeviceInitialStep,
      steps,
      token,
      urls,
      woopraCookie,
      anonymousUuid,
      analyticsSessionUuid,
    }
  }

  onFlowChange: FlowChangeCallback = (
    newFlow,
    _newStep,
    _previousFlow,
    { userStepIndex, clientStepIndex }
  ) => {
    if (newFlow === 'crossDeviceSteps') {
      this.setState({
        crossDeviceInitialStep: userStepIndex,
        crossDeviceInitialClientStep: clientStepIndex,
      })
    }
  }

  checkUnsupportedBrowserError = (): boolean => {
    const steps = this.props.options.steps
    const shouldStrictlyUseCamera =
      steps && steps.some(isUploadFallbackOffAndShouldUseCamera)
    const { hasCamera } = this.props

    const findStep = buildStepFinder(steps)
    const faceStep = findStep('face')

    const photoCaptureFallback = faceStep?.options?.photoCaptureFallback ?? true

    const canVideoFallbackToPhoto =
      window.MediaRecorder != null || photoCaptureFallback

    const isLivenessRequired =
      !canVideoFallbackToPhoto &&
      faceStep?.options?.requestedVariant === 'video'

    return (
      !isDesktop &&
      ((!hasCamera && shouldStrictlyUseCamera === true) || isLivenessRequired)
    )
  }

  render(): h.JSX.Element {
    if (this.checkUnsupportedBrowserError()) {
      return (
        <WrappedError
          disableNavigation
          error={{ name: getUnsupportedMobileBrowserError() }}
        />
      )
    }

    const { token, options, urls } = this.props

    return (
      <SdkConfigurationServiceProvider
        overrideConfiguration={this.props.options.overrideSdkConfiguration}
        url={urls.onfido_api_url}
        token={token}
        fallback={
          <Spinner shouldAutoFocus={options.autoFocusOnInitialScreenTitle} />
        }
      >
        <UserConsentProvider
          url={urls.onfido_api_url}
          token={token}
          fallback={
            <Spinner shouldAutoFocus={options.autoFocusOnInitialScreenTitle} />
          }
        >
          <OptionsStepsProvider options={this.props.options}>
            {(steps) => (
              <HistoryRouter
                {...this.props}
                mobileConfig={this.generateMobileConfig()}
                onFlowChange={this.onFlowChange}
                stepIndexType="user"
                steps={steps}
              />
            )}
          </OptionsStepsProvider>
        </UserConsentProvider>
      </SdkConfigurationServiceProvider>
    )
  }
}
