import { useCallback, useState } from 'preact/hooks'
import { StepsHook, StepsLoadingStatus } from '~types/routers'
import { StepConfig } from '~types/steps'

export const createCrossDeviceSteps = (
  defaultSteps: StepConfig[],
  onCompleteStep: (docData: unknown[]) => void
): StepsHook => () => {
  const [status, setStatus] = useState<StepsLoadingStatus>('idle')
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
