import { useCallback, useState } from 'preact/hooks'
import { StepsHook } from '~types/routers'
import { StepConfig } from '~types/steps'

const isComplete = (step: StepConfig): boolean => step.type === 'complete'
const hasCompleteStep = (steps: StepConfig[]): boolean => steps.some(isComplete)

export const createCrossDeviceStepsHook = (
  defaultSteps: StepConfig[],
  onCompleteStep: (docData: unknown[]) => void
): StepsHook => () => {
  const [hasNextStep, setHasNextStep] = useState<boolean>(true)

  // Mobile must have a complete step to finish the cross-device session.
  const [steps] = useState(() =>
    hasCompleteStep(defaultSteps)
      ? defaultSteps
      : [...defaultSteps, { type: 'complete' } as StepConfig]
  )

  return {
    loadNextStep: useCallback(() => setHasNextStep(false), []),
    completeStep: useCallback((data) => {
      if (Array.isArray(data)) onCompleteStep(data)
    }, []),
    error: undefined,
    loading: false,
    hasPreviousStep: false,
    hasNextStep,
    steps,
  }
}
