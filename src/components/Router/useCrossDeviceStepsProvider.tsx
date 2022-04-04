import { useCallback, useState } from 'preact/hooks'
import { StepsProvider, StepsProviderStatus } from '~types/routers'
import { StepConfig } from '~types/steps'

export const createCrossDeviceStepsProvider = (
  defaultSteps: StepConfig[],
  onCompleteStep: (docData: unknown[]) => void
): StepsProvider => () => {
  const [status, setStatus] = useState<StepsProviderStatus>('idle')
  const [steps] = useState(defaultSteps)

  return {
    loadNextStep: useCallback(() => setStatus('finished'), []),
    completeStep: useCallback((data) => {
      if (Array.isArray(data)) onCompleteStep(data)
    }, []),
    error: undefined,
    status,
    steps,
  }
}
