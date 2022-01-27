import { h, Component } from 'preact'

import { isDesktop, getUnsupportedMobileBrowserError } from '~utils'
import { buildStepFinder } from '~utils/steps'
import withTheme from '../Theme'
import GenericError from '../GenericError'

import { getWoopraCookie } from '../../Tracker'
import HistoryRouter from './HistoryRouter'
import WorkflowHistoryRouter from './WorkflowHistoryRouter'

import type { MobileConfig } from '~types/commons'
import type { StepConfig } from '~types/steps'
import type { FlowChangeCallback, InternalRouterProps } from '~types/routers'

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
  workflowSteps?: StepConfig[]
}

export default class MainRouter extends Component<InternalRouterProps, State> {
  useWorkflowRun = (): boolean => {
    const { useWorkflow } = this.props.options
    return !!useWorkflow
  }

  generateMobileConfig = (): MobileConfig => {
    const {
      documentType,
      idDocumentIssuingCountry,
      poaDocumentType,
      deviceHasCameraSupport,
      options,
      urls,
      analyticsSessionUuid,
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
      useWorkflow,
    } = options
    const woopraCookie = !disableAnalytics ? getWoopraCookie() : null
    if (!steps) {
      throw new Error('steps not provided')
    }

    const {
      crossDeviceInitialClientStep,
      crossDeviceInitialStep,
      workflowSteps,
    } = this.state

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
      steps: workflowSteps ? workflowSteps : steps,
      token,
      urls,
      woopraCookie,
      analyticsSessionUuid,
    }
  }

  onFlowChange: FlowChangeCallback = (
    newFlow,
    _newStep,
    _previousFlow,
    { userStepIndex, clientStepIndex },
    workflowSteps
  ) => {
    console.log('hola', workflowSteps)
    console.log('newFlow', newFlow)
    console.log('_newStep', _newStep)
    console.log('_previousFlow', _previousFlow)
    console.log(
      'userStepIndex, clientStepIndex',
      userStepIndex,
      clientStepIndex
    )

    if (newFlow === 'crossDeviceSteps') {
      this.setState({
        crossDeviceInitialStep: userStepIndex,
        crossDeviceInitialClientStep: clientStepIndex,
      })
      if (this.useWorkflowRun()) {
        this.setState({
          workflowSteps: workflowSteps,
        })
      }
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

    return this.useWorkflowRun() ? (
      <WorkflowHistoryRouter
        {...this.props}
        mobileConfig={this.generateMobileConfig()}
        onFlowChange={this.onFlowChange}
        stepIndexType="user"
        steps={this.props.options.steps}
      />
    ) : (
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
