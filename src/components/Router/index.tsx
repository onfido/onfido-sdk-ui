import { h, Component, FunctionComponent } from 'preact'

import { isDesktop, getUnsupportedMobileBrowserError } from '~utils/index'
import withTheme from '../Theme'
import GenericError, { OwnProps as GenericErrorProps } from '../GenericError'
import withCameraDetection from '../Capture/withCameraDetection'

import { getWoopraCookie } from '../../Tracker'
import HistoryRouter from './HistoryRouter'
import CrossDeviceMobileRouter from './CrossDeviceMobileRouter'

import type { MobileConfig } from '~types/commons'
import type { StepConfig } from '~types/steps'
import type { FlowChangeCallback, RouterOwnProps, RouterProps } from './types'

const isUploadFallbackOffAndShouldUseCamera = (step: StepConfig): boolean => {
  if (!step.options || (step.type != 'document' && step.type != 'face')) {
    return false
  }

  return (
    step.options?.uploadFallback === false &&
    (step.type === 'face' || step.options?.useLiveDocumentCapture)
  )
}

const Router: FunctionComponent<RouterProps> = (props) => {
  const RouterComponent = props.options.mobileFlow
    ? CrossDeviceMobileRouter
    : MainRouter

  return (
    <RouterComponent
      {...props}
      allowCrossDeviceFlow={!props.options.mobileFlow && isDesktop}
    />
  )
}

// Wrap components with theme that include navigation and footer
const WrappedError = withTheme<GenericErrorProps>(GenericError)

type MainState = {
  crossDeviceInitialClientStep?: number
  crossDeviceInitialStep?: number
}

class MainRouter extends Component<RouterProps, MainState> {
  constructor(props: RouterProps) {
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

  renderUnsupportedBrowserError = () => {
    const steps = this.props.options.steps
    const shouldStrictlyUseCamera =
      steps && steps.some(isUploadFallbackOffAndShouldUseCamera)
    const { hasCamera } = this.props

    if (!isDesktop && !hasCamera && shouldStrictlyUseCamera) {
      return (
        <WrappedError
          disableNavigation={true}
          error={{ name: getUnsupportedMobileBrowserError() }}
        />
      )
    }

    return null
  }

  render = () =>
    this.renderUnsupportedBrowserError() || (
      <HistoryRouter
        {...this.props}
        mobileConfig={this.generateMobileConfig()}
        onFlowChange={this.onFlowChange}
        stepIndexType="user"
        steps={this.props.options.steps}
      />
    )
}

export default withCameraDetection<RouterOwnProps>(Router)
