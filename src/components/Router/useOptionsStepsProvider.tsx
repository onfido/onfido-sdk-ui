import { useCallback, useState } from 'preact/hooks'
import { StepsProvider, StepsProviderStatus } from '~types/routers'
import { SdkOptions } from '~types/sdk'
import { StepConfig } from '~types/steps'

export const createOptionsStepsProvider = (
  options: SdkOptions
): StepsProvider => () => {
  const [status, setStatus] = useState<StepsProviderStatus>('idle')
  const [steps] = useState<StepConfig[]>(options.steps as StepConfig[])

  return {
    loadNextStep: useCallback(() => setStatus('finished'), []),
    completeStep: useCallback(
      () => Promise.resolve().then(() => setStatus('complete')),
      []
    ),
    error: undefined,
    status,
    steps,
  }
}
