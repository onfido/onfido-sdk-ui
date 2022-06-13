import { useCallback, useState } from 'preact/hooks'
import { StepsHook } from '~types/routers'
import { StepConfig } from '~types/steps'

export const createCrossDeviceStepsHook = (
  defaultSteps: StepConfig[],
  onCompleteStep: (docData: unknown[]) => void
): StepsHook => () => {
  const [hasNextStep, setHasNextStep] = useState<boolean>(true)
  const [steps] = useState(defaultSteps)

  return {
    loadNextStep: useCallback(() => setHasNextStep(false), []),
    completeStep: useCallback((data) => {
      if (Array.isArray(data)) onCompleteStep(data)
    }, []),
    error: undefined,
    loading: false,
    hasNextStep,
    steps,
  }
}
