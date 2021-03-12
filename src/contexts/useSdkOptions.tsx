import { h, createContext, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import type { NarrowSdkOptions } from '~types/commons'
import type { StepTypes, StepConfig, StepConfigsMap } from '~types/steps'

type FindStepCallback = <T extends StepTypes>(
  type: T
) => Partial<StepConfigsMap>[T]

type EnhancedSdkOptions = {
  findStep: FindStepCallback
} & NarrowSdkOptions

const SdkOptionsContext = createContext<EnhancedSdkOptions | undefined>(
  undefined
)

type Props = {
  options: NarrowSdkOptions
}

export const SdkOptionsProvider: FunctionComponent<Props> = ({
  children,
  options,
}) => {
  const { steps } = options

  const mappedSteps = Object.fromEntries(
    steps.map((step) => [step.type, step])
  ) as Partial<StepConfigsMap>

  const findStep: FindStepCallback = (type) => mappedSteps[type]

  return (
    <SdkOptionsContext.Provider value={{ ...options, findStep }}>
      {children}
    </SdkOptionsContext.Provider>
  )
}

export const findStep = <T extends StepTypes>(steps: StepConfig[], type: T) => {
  const mappedSteps = Object.fromEntries(
    steps.map((step) => [step.type, step])
  ) as Partial<StepConfigsMap>

  return mappedSteps[type]
}

export const useSdkOptions = (): EnhancedSdkOptions => {
  const options = useContext(SdkOptionsContext)

  if (!options) {
    throw new Error(`SDK options wasn't initialized!`)
  }

  return options
}
