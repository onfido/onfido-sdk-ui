import { h, Component } from 'preact'
import {
  createMemoryHistory,
  createBrowserHistory,
  History,
  LocationListener,
  MemoryHistory,
} from 'history'

import { buildComponentsList } from './StepComponentMap'
import StepsRouter from './StepsRouter'

import { trackException } from '../../Tracker'

import type { ApiParsedError, ErrorCallback } from '~types/api'
import type { ExtendedStepTypes, FlowVariants } from '~types/commons'
import type { CaptureKeys } from '~types/redux'
import type {
  ComponentStep,
  ChangeFlowProp,
  HistoryRouterProps,
} from '~types/routers'
import type { DocumentTypes, StepConfigDocument } from '~types/steps'

type FormattedError = {
  type: 'expired_token' | 'exception'
  message: string
}

type HistoryLocationState = {
  step: number
  flow: FlowVariants
}

type State = {
  initialStep: number
} & HistoryLocationState

const findFirstIndex = (
  componentsList: ComponentStep[],
  clientStepIndex: number
) => componentsList.findIndex(({ stepIndex }) => stepIndex === clientStepIndex)

export default class HistoryRouter extends Component<
  HistoryRouterProps,
  State
> {
  private history:
    | MemoryHistory<HistoryLocationState>
    | History<HistoryLocationState>
  private unlisten: () => void

  constructor(props: HistoryRouterProps) {
    super(props)

    const componentsList = this.getComponentsList('captureSteps', this.props)

    const stepIndex =
      this.props.stepIndexType === 'client'
        ? findFirstIndex(componentsList, this.props.step || 0)
        : this.props.step || 0

    this.state = {
      flow: 'captureSteps',
      step: stepIndex,
      initialStep: stepIndex,
    }
    this.history = this.props.options.useMemoryHistory
      ? createMemoryHistory()
      : createBrowserHistory()
    this.unlisten = this.history.listen(this.onHistoryChange)
    this.setStepIndex(this.state.step, this.state.flow)
  }

  onHistoryChange: LocationListener<HistoryLocationState> = ({
    state: historyState,
  }) => {
    this.setState({ ...historyState })
  }

  componentWillUnmount(): void {
    this.unlisten()
  }

  getStepType = (step: number): Optional<ExtendedStepTypes> => {
    const componentList = this.getComponentsList()
    return componentList[step] ? componentList[step].step.type : null
  }

  disableNavigation = (): boolean => {
    return (
      this.props.isNavigationDisabled ||
      this.initialStep() ||
      this.getStepType(this.state.step) === 'complete'
    )
  }

  initialStep = (): boolean =>
    this.state.initialStep === this.state.step &&
    this.state.flow === 'captureSteps'

  changeFlowTo: ChangeFlowProp = (
    newFlow,
    newStep = 0,
    excludeStepFromHistory = false
  ) => {
    const { onFlowChange } = this.props
    const { flow: previousFlow, step: previousUserStepIndex } = this.state
    if (previousFlow === newFlow) return

    const previousUserStep = this.getComponentsList()[previousUserStepIndex]

    onFlowChange &&
      onFlowChange(newFlow, newStep, previousFlow, {
        userStepIndex: previousUserStepIndex,
        clientStepIndex: previousUserStep.stepIndex,
        clientStep: previousUserStep,
      })
    this.setStepIndex(newStep, newFlow, excludeStepFromHistory)
  }

  nextStep = (): void => {
    const { step: currentStep } = this.state
    const componentsList = this.getComponentsList()
    const newStepIndex = currentStep + 1
    if (componentsList.length === newStepIndex) {
      this.triggerOnComplete()
    } else {
      this.setStepIndex(newStepIndex)
    }
  }

  triggerOnComplete = (): void => {
    const { captures } = this.props

    const data = (Object.keys(captures) as CaptureKeys[]).reduce(
      (acc, key) => ({
        ...acc,
        [key]: captures[key]?.metadata,
      }),
      {}
    )

    this.props.options.events?.emit('complete', data)
  }

  formattedError = ({ response, status }: ApiParsedError): FormattedError => {
    const errorResponse = response.error || response || {}

    const isExpiredTokenError =
      status === 401 && errorResponse.type === 'expired_token'
    const type = isExpiredTokenError ? 'expired_token' : 'exception'
    // `/validate_document` returns a string only. Example: "Token has expired."
    // Ticket in backlog to update all APIs to use signature similar to main Onfido API
    const message = errorResponse.message || response.message || 'Unknown error'
    return { type, message }
  }

  triggerOnError: ErrorCallback = ({ response, status }) => {
    if (status === 0) {
      return
    }

    const error = this.formattedError({ response, status })
    const { type, message } = error
    this.props.options.events?.emit('error', { type, message })
    trackException(`${type} - ${message}`)
  }

  previousStep = (): void => {
    const { step: currentStep } = this.state
    this.setStepIndex(currentStep - 1)
  }

  back = (): void => {
    this.history.goBack()
  }

  setStepIndex = (
    newStepIndex: number,
    newFlow?: FlowVariants,
    excludeStepFromHistory?: boolean
  ): void => {
    const { flow: currentFlow } = this.state
    const newState = {
      step: newStepIndex,
      flow: newFlow || currentFlow,
    }
    if (excludeStepFromHistory) {
      this.setState(newState)
    } else {
      const path = `${location.pathname}${location.search}${location.hash}`
      this.history.push(path, newState)
    }
  }

  getComponentsList = (
    flow?: FlowVariants,
    props: HistoryRouterProps = this.props
  ): ComponentStep[] => {
    const {
      documentType,
      steps,
      deviceHasCameraSupport,
      options: { mobileFlow },
    } = props

    if (!steps) {
      throw new Error('steps not provided')
    }

    return buildComponentsList({
      flow: flow || this.state.flow,
      documentType,
      steps,
      mobileFlow,
      deviceHasCameraSupport,
    })
  }

  getDocumentType = (): DocumentTypes | undefined => {
    const { documentType, steps } = this.props
    const documentStep = steps?.find(
      (step) => step.type === 'document'
    ) as StepConfigDocument

    const documentTypes = documentStep?.options?.documentTypes || {}
    const enabledDocuments = Object.keys(documentTypes) as DocumentTypes[]
    const isSinglePreselectedDocument = enabledDocuments.length === 1

    if (isSinglePreselectedDocument && !documentType) {
      return enabledDocuments[0]
    }

    return documentType
  }

  render(): h.JSX.Element {
    const documentType = this.getDocumentType()

    return (
      <StepsRouter
        {...this.props}
        back={this.back}
        changeFlowTo={this.changeFlowTo}
        componentsList={this.getComponentsList()}
        disableNavigation={this.disableNavigation()}
        documentType={documentType}
        nextStep={this.nextStep}
        previousStep={this.previousStep}
        step={this.state.step}
        triggerOnError={this.triggerOnError}
      />
    )
  }
}
