import { useCallback, useEffect, useState } from 'preact/hooks'
import { StepsHook } from '~types/routers'
import { StepConfig } from '~types/steps'
import useUserConsent from '~contexts/useUserConsent'
import { NarrowSdkOptions } from '~types/commons'

export const createOptionsStepsHook = (
  options: NarrowSdkOptions
): StepsHook => () => {
  const { addUserConsentStep } = useUserConsent()
  const [hasNextStep, setHasNextStep] = useState<boolean>(true)
  const [steps, setSteps] = useState<StepConfig[] | undefined>(undefined)

  useEffect(() => {
    setSteps(addUserConsentStep(options.steps))
  }, [addUserConsentStep])

  return {
    loadNextStep: useCallback(() => setHasNextStep(false), []),
    completeStep: useCallback(() => ({}), []),
    error: undefined,
    loading: false,
    hasNextStep,
    steps,
  }
}
