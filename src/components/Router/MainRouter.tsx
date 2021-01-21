import { h, Component } from 'preact'

import { isDesktop, getUnsupportedMobileBrowserError } from '~utils'
import withTheme from '../Theme'
import GenericError from '../GenericError'

import { getWoopraCookie } from '../../Tracker'
import HistoryRouter from './HistoryRouter'

import type { MobileConfig } from '~types/commons'
import type { StepConfig } from '~types/steps'
import type { FlowChangeCallback, RouterProps as Props } from '~types/routers'

const isUploadFallbackOffAndShouldUseCamera = (step: StepConfig): boolean => {
  if (!step.options || (step.type != 'document' && step.type != 'face')) {
    return false
  }

  return (
    step.options?.uploadFallback === false &&
    (step.type === 'face' || step.options?.useLiveDocumentCapture)
  )
}

// Wrap components with theme that include navigation and footer
const WrappedError = withTheme(GenericError)

type State = {
  crossDeviceInitialClientStep?: number
  crossDeviceInitialStep?: number
}

export default class MainRouter extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      crossDeviceInitialStep: null,
    }
  }

  generateMobileConfig = (): MobileConfig => {
    const {
      documentType,
      idDocumentIssuingCountry,
      poaDocumentType,
      deviceHasCameraSupport,
      options,
      urls,
    } = this.props

    const {
      steps,
      token,
      language,
      disableAnalytics,
      enterpriseFeatures,
    } = options

    const woopraCookie = !disableAnalytics ? getWoopraCookie() : null

    return {
      clientStepIndex: this.state.crossDeviceInitialClientStep,
      deviceHasCameraSupport,
      disableAnalytics,
      documentType,
      enterpriseFeatures,
      idDocumentIssuingCountry,
      language,
      poaDocumentType,
      step: this.state.crossDeviceInitialStep,
      steps,
      token,
      urls,
      woopraCookie,
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

    return !isDesktop && !hasCamera && shouldStrictlyUseCamera
  }

  render(): h.JSX.Element {
    if (this.checkUnsupportedBrowserError()) {
      return (
        <WrappedError
          disableNavigation={true}
          error={{ name: getUnsupportedMobileBrowserError() }}
        />
      )
    }

    return (
      <HistoryRouter
        {...this.props}
        mobileConfig={this.generateMobileConfig()}
        onFlowChange={this.onFlowChange}
        stepIndexType="user"
        steps={this.props.options.steps}
      />
    )
  }
}
