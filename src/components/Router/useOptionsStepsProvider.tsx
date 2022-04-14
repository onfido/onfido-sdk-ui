import { useCallback, useEffect, useState } from 'preact/hooks'
import { StepsProvider, StepsProviderStatus } from '~types/routers'
import { StepConfig } from '~types/steps'
import useUserConsent from '~contexts/useUserConsent'
import { NarrowSdkOptions } from '~types/commons'

export const createOptionsStepsProvider = (
  options: NarrowSdkOptions
): StepsProvider => () => {
  const { enabled, consents } = useUserConsent()
  const [status, setStatus] = useState<StepsProviderStatus>('idle')
  const [steps, setSteps] = useState<StepConfig[]>(options.steps)

  useEffect(() => {
    if (!enabled || consents.every(({ required }) => !required)) {
      return
    }

    const userConsent: StepConfig = {
      type: 'userConsent',
      skip: consents.every((c) => !c.required || (c.required && c.granted)),
    }

    const welcomeIndex = options.steps.findIndex(
      ({ type }) => type === 'welcome'
    )
    const userConsentIndex = welcomeIndex === -1 ? 0 : welcomeIndex + 1

    setSteps([
      ...options.steps.slice(0, userConsentIndex),
      userConsent,
      ...options.steps.slice(userConsentIndex),
    ] as StepConfig[])
  }, [consents, enabled])

  return {
    loadNextStep: useCallback(() => setStatus('finished'), []),
    completeStep: useCallback(() => ({}), []),
    error: undefined,
    status,
    steps,
  }
}
