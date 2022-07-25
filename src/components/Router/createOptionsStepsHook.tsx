import { useCallback, useEffect, useState } from 'preact/hooks'
import { StepsHook } from '~types/routers'
import { StepConfig } from '~types/steps'
import useUserConsent from '~contexts/useUserConsent'
import useActiveVideo from '~contexts/useActiveVideo'
import { NarrowSdkOptions } from '~types/commons'
import { useDocumentTypesAdapter } from '../RestrictedDocumentSelection'

export const createOptionsStepsHook = (
  options: NarrowSdkOptions
): StepsHook => () => {
  const { addUserConsentStep } = useUserConsent()
  const { addActiveVideoStep } = useActiveVideo()
  const { documentTypesAdapter } = useDocumentTypesAdapter()
  const [hasNextStep, setHasNextStep] = useState<boolean>(true)
  const [steps, setSteps] = useState<StepConfig[] | undefined>(undefined)

  useEffect(() => {
    setSteps(
      addUserConsentStep(
        addActiveVideoStep(documentTypesAdapter(options.steps))
      )
    )
  }, [addUserConsentStep, addActiveVideoStep, documentTypesAdapter])

  return {
    loadNextStep: useCallback(() => setHasNextStep(false), []),
    completeStep: useCallback(() => ({}), []),
    error: undefined,
    loading: false,
    hasPreviousStep: false,
    hasNextStep,
    steps,
  }
}
