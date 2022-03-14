import { useCallback, useState } from 'preact/hooks'
import { StepsProvider, StepsProviderStatus } from '~types/routers'
import { StepConfig } from '~types/steps'

export const createCrossDeviceStepsProvider = (
  defaultSteps: StepConfig[],
  onCompleteStep: (data: unknown) => void
): StepsProvider => () => {
  const [status, setStatus] = useState<StepsProviderStatus>('idle')
  const [steps] = useState(defaultSteps)

  return {
    loadNextStep: useCallback(() => setStatus('complete'), []),
    completeStep: useCallback(
      (docData: unknown) =>
        Promise.resolve().then(() => onCompleteStep(docData)),
      []
    ),
    error: undefined,
    status,
    steps,
  }
}
