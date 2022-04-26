import { h } from 'preact'

import { buildStepFinder, findFirstIndex } from '~utils/steps'
import { buildComponentsList } from './StepComponentMap'
import StepsRouter from './StepsRouter'

import { trackException } from '../../Tracker'

import type { ErrorCallback, ParsedError } from '~types/api'
import type { FlowVariants, FormattedError } from '~types/commons'
import type { CaptureKeys } from '~types/redux'
import type {
  ChangeFlowProp,
  ComponentStep,
  HistoryLocationState,
  HistoryRouterProps,
} from '~types/routers'
import type { SdkResponse } from '~types/sdk'
import type { DocumentTypes, StepConfig } from '~types/steps'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { useHistory } from './useHistory'

type HistoryRouterState = {
  initialStep: number
} & HistoryLocationState

const formattedError = ({ response, status }: ParsedError): FormattedError => {
  const errorResponse = response.error || response || {}

  const isExpiredTokenError =
    status === 401 && errorResponse.type === 'expired_token'
  const type = isExpiredTokenError ? 'expired_token' : 'exception'
  // `/validate_document` returns a string only. Example: "Token has expired."
  // Ticket in backlog to update all APIs to use signature similar to main Onfido API
  const message = errorResponse.message || response.message || 'Unknown error'
  return { type, message }
}

export const HistoryRouter = (props: HistoryRouterProps) => {
  const {
    currentStepType,
    actions,
    isNavigationDisabled,
    onFlowChange,
    captures,
    options,
    documentType,
    step: defaultStep,
    stepIndexType,
    deviceHasCameraSupport,
    options: { mobileFlow, useMemoryHistory },
    useSteps,
  } = props

  const getComponentsList = (
    steps: StepConfig[],
    flow?: FlowVariants
  ): ComponentStep[] => {
    if (!steps) {
      throw new Error('steps not provided')
    }

    return buildComponentsList({
      flow: flow || state.flow,
      documentType,
      steps,
      mobileFlow,
      deviceHasCameraSupport,
    })
  }

  const { back, forward, push } = useHistory(({ state: historyState }) => {
    if (!historyState) {
      return
    }

    const { step } = getComponentsList(steps, historyState.flow)[
      historyState.step
    ]

    if (step.skip) {
      historyState.step < state.step ? back() : forward()
    } else {
      setState({ ...state, ...historyState })
    }
  }, useMemoryHistory)

  const { loadNextStep, completeStep, error, status, steps } = useSteps()

  const [state, setState] = useState<HistoryRouterState>(() => {
    const componentsList = getComponentsList(steps, 'captureSteps')

    const stepIndex =
      stepIndexType === 'client'
        ? findFirstIndex(componentsList, defaultStep || 0)
        : defaultStep || 0

    push({
      flow: 'captureSteps',
      step: stepIndex,
    })

    const stepType = componentsList[stepIndex].step.type
    actions.setCurrentStepType(stepType)

    return {
      flow: 'captureSteps',
      step: stepIndex,
      initialStep: stepIndex,
    }
  })

  const setStepIndex = (
    newStepIndex: number,
    newFlow?: FlowVariants,
    excludeStepFromHistory?: boolean
  ): void => {
    const { flow: currentFlow } = state
    const newState = {
      step: newStepIndex,
      flow: newFlow || currentFlow,
    }
    if (excludeStepFromHistory) {
      setState({ ...state, ...newState })
    } else {
      push(newState)
    }
  }

  const disableNavigation = (): boolean => {
    const getInitialStep = () => {
      return state.initialStep === state.step && state.flow === 'captureSteps'
    }

    const getStepType = (step: number) => {
      const componentList = getComponentsList(steps)
      return componentList[step] ? componentList[step].step.type : undefined
    }

    const firstEnabledStep = () =>
      state.step > 0 &&
      getComponentsList(steps)
        .slice(0, state.step)
        .every((c) => c.step.skip)

    return (
      isNavigationDisabled ||
      getInitialStep() ||
      getStepType(state.step) === 'complete' ||
      firstEnabledStep()
    )
  }

  const changeFlowTo: ChangeFlowProp = (
    newFlow,
    newStep = 0,
    excludeStepFromHistory = false
  ) => {
    const { flow: previousFlow, step: previousUserStepIndex } = state
    if (previousFlow === newFlow) return

    const previousUserStep = getComponentsList(steps)[previousUserStepIndex]

    onFlowChange &&
      onFlowChange(
        newFlow,
        newStep,
        previousFlow,
        {
          userStepIndex: previousUserStepIndex,
          clientStepIndex: previousUserStep.stepIndex,
          clientStep: previousUserStep,
        },
        steps
      )
    setStepIndex(newStep, newFlow, excludeStepFromHistory)
  }

  const nextStep = () => {
    const { step: currentStep } = state
    const componentsList = getComponentsList(steps)

    const nextStepComponent = componentsList
      .slice(currentStep + 1)
      .find((c) => !c.step.skip)

    if (nextStepComponent) {
      const newStepIndex = componentsList.indexOf(nextStepComponent)

      setStepIndex(newStepIndex)

      const newStepType = nextStepComponent.step.type
      const isNewStepType = currentStepType !== newStepType
      if (isNewStepType) {
        actions.setCurrentStepType(newStepType)
      }
    } else if (status !== 'finished') {
      loadNextStep(() => {
        setStepIndex(0, 'captureSteps')
      })
    }
  }

  const triggerOnError: ErrorCallback = useCallback(
    ({ response, status }) => {
      if (status === 0) {
        return
      }

      const error = formattedError({ response, status })
      const { type, message } = error
      options.events?.emit('error', { type, message })
      trackException(`${type} - ${message}`)
    },
    [options.events]
  )

  const triggerOnComplete = useCallback(() => {
    const expectedCaptureKeys: CaptureKeys[] = [
      'document_front',
      'document_back',
      'face',
      'data',
      'poa',
    ]
    const data: SdkResponse = Object.entries(captures)
      .filter(([key, value]) => key !== 'takesHistory' && value != null)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value?.metadata }), {})

    const keysWithMissingData: Array<string> = []

    expectedCaptureKeys.forEach((key) => {
      if (key in data && data[key] === undefined) {
        keysWithMissingData.push(key)
      }
    })

    if (keysWithMissingData.length) {
      triggerOnError({
        response: {
          type: 'exception',
          message: `The following keys have missing data: ${keysWithMissingData}`,
        },
      })
      return
    }

    options.events?.emit('complete', data)
  }, [captures, options.events, triggerOnError])

  const previousStep = () => {
    const { step: currentStep } = state
    setStepIndex(currentStep - 1)
  }

  const getDocumentType = () => {
    const findStep = buildStepFinder(steps)
    const documentStep = findStep('document')
    const documentTypes = documentStep?.options?.documentTypes || {}
    const enabledDocuments = Object.keys(documentTypes) as DocumentTypes[]
    const isSinglePreselectedDocument = enabledDocuments.length === 1

    if (isSinglePreselectedDocument && !documentType) {
      return enabledDocuments[0]
    }

    return documentType
  }

  useEffect(() => {
    if (status === 'finished') {
      triggerOnComplete()
    }
  }, [status, triggerOnComplete])

  if (status === 'error') {
    return (
      <div>
        <p>There was a server error!</p>
        <p>{error}</p>
        <p>Please try reloading the app, and try again.</p>
      </div>
    )
  }

  return (
    <StepsRouter
      {...props}
      completeStep={completeStep}
      back={back}
      changeFlowTo={changeFlowTo}
      componentsList={getComponentsList(steps)}
      disableNavigation={disableNavigation()}
      documentType={getDocumentType()}
      nextStep={nextStep}
      previousStep={previousStep}
      step={state.step}
      triggerOnError={triggerOnError}
      isLoadingStep={status === 'loading'}
    />
  )
}
