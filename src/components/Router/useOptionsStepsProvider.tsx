import { useCallback, useEffect, useState } from 'preact/hooks'
import { StepsProvider, StepsProviderStatus } from '~types/routers'
import { StepConfig } from '~types/steps'
import useUserConsent from '~contexts/useUserConsent'
import { NarrowSdkOptions } from '~types/commons'

export const createOptionsStepsProvider = (
  options: NarrowSdkOptions
): StepsProvider => () => {
  const { addUserConsentStep } = useUserConsent()
  const [status, setStatus] = useState<StepsProviderStatus>('idle')
  const [steps, setSteps] = useState<StepConfig[]>(options.steps)

  useEffect(() => {
    setSteps(addUserConsentStep(options.steps))
  }, [addUserConsentStep])

  return {
    loadNextStep: useCallback(() => setStatus('finished'), []),
    completeStep: useCallback(() => ({}), []),
    error: undefined,
    status,
    steps,
  }
}
