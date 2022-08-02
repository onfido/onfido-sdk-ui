import { StepsHook } from '~types/routers'
import { StepConfig } from '~types/steps'

type MockedStepsHook = {
  steps: StepConfig[] | undefined
}

const createMockStepsHook = ({
  steps = undefined,
}: MockedStepsHook): StepsHook => {
  return () => ({
    completeStep: () => null,
    loadNextStep: () => null,
    hasPreviousStep: false,
    hasNextStep: false,
    loading: false,
    steps,
    error: undefined,
  })
}

export default createMockStepsHook
