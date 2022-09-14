import { Fragment, h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { loadExternalScript } from '~utils/dynamicLoading'
import { buildStepFinder, findFirstEnabled, findFirstIndex } from '~utils/steps'

import type { FlowVariants } from '~types/commons'
import type { CaptureKeys } from '~types/redux'
import type {
  ChangeFlowProp,
  ComponentStep,
  HistoryLocationState,
  HistoryRouterProps,
  HistoryRouterWrapperProps,
} from '~types/routers'
import type { SdkResponse } from '~types/sdk'
import type { DocumentTypes, StepConfig } from '~types/steps'
import { SdkConfigurationServiceContext } from '~contexts/useSdkConfigurationService'

import { sendEvent } from '../../Tracker'

import { useHistory } from './useHistory'
import { buildComponentsList } from './StepComponentMap'
import StepsRouter from './StepsRouter'

const { PASSIVE_SIGNALS_URL } = process.env

type HistoryRouterState = {
  initialStep: number
} & HistoryLocationState

export const HistoryRouterWrapper = ({
  useSteps,
  fallback,
  ...props
}: HistoryRouterWrapperProps) => {
  const { steps, error, loading, ...useStepsProps } = useSteps()

  if (!steps || loading) {
    return <Fragment>{fallback}</Fragment>
  }

  if (error) {
    return (
      <div data-page-id={'Error'}>
        <p>There was a server error!</p>
        <p data-qa="error">{error}</p>
        <p>Please try reloading the app, and try again.</p>
      </div>
    )
  }

  return (
    <SdkConfigurationServiceContext.Consumer>
      {(configuration) => {
        return (
          <HistoryRouter
            {...props}
            {...useStepsProps}
            steps={steps}
            sdkConfiguration={configuration}
          />
        )
      }}
    </SdkConfigurationServiceContext.Consumer>
  )
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
    options: { mobileFlow, useMemoryHistory, token },
    steps,
    hasNextStep,
    hasPreviousStep,
    loadNextStep,
    completeStep,
    triggerOnError,
    sdkConfiguration,
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
      hasPreviousStep,
    })
  }

  const [passiveSignalsTracker, setPassiveSignalsTracker] = useState<
    PassiveSignals.Tracker | undefined
  >(undefined)

  useEffect(() => {
    // Don't load the Passive Signals module by default
    const enabled =
      sdkConfiguration?.device_intelligence?.passive_signals?.enabled || false

    if (!enabled || !token || !PASSIVE_SIGNALS_URL) {
      return
    }

    loadExternalScript(PASSIVE_SIGNALS_URL, () => {
      if (window.PassiveSignalsTracker) {
        const tracker = new window.PassiveSignalsTracker({ jwt: token })
        setPassiveSignalsTracker(tracker)
        tracker.track()
      }
    })

    return () => {
      // Stop all the connected tracers
      passiveSignalsTracker?.stop()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { back, forward, push } = useHistory(({ state: historyState }) => {
    const { step } = getComponentsList(steps, historyState.flow)[
      historyState.step
    ]

    if (step.skip) {
      historyState.step < state.step ? back() : forward()
    } else {
      setState({ ...state, ...historyState })
    }
  }, useMemoryHistory)

  const [state, setState] = useState<HistoryRouterState>(() => {
    const componentsList = getComponentsList(steps, 'captureSteps')

    const stepIndex =
      stepIndexType === 'client'
        ? findFirstIndex(componentsList, defaultStep || 0)
        : findFirstEnabled(componentsList)

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
    const { flow: previousFlow, step: previousStepIndex } = state

    if (!onFlowChange || previousFlow === newFlow) {
      return
    }

    const previousStep = getComponentsList(steps)[previousStepIndex]

    onFlowChange(newFlow, {
      clientStepIndex: previousStep.stepIndex,
      clientSteps: steps,
    })

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
    } else if (hasNextStep) {
      loadNextStep(() => {
        setStepIndex(0, 'captureSteps')
      }, state.flow)
    }
  }

  const triggerOnComplete = useCallback(() => {
    const expectedCaptureKeys: CaptureKeys[] = [
      'document_front',
      'document_back',
      'face',
      'data',
      'poa',
      'active_video',
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

  const goBack = () => {
    sendEvent('navigation_back_button_clicked')
    back()
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
    if (!hasNextStep) {
      triggerOnComplete()
    }
  }, [hasNextStep, triggerOnComplete])

  return (
    <StepsRouter
      {...props}
      completeStep={completeStep}
      back={goBack}
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
