import { h, createContext, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import type { NarrowSdkOptions } from '~types/commons'
import type { StepTypes, StepConfigsMap } from '~types/steps'

type FindStepCallback = <T extends StepTypes>(
  type: T
) => Partial<StepConfigsMap>[T]

type EnhancedOptions = {
  findStep: FindStepCallback
}

type SdkOptionsContextType = [NarrowSdkOptions, EnhancedOptions]

const SdkOptionsContext = createContext<SdkOptionsContextType | undefined>(
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

  const enhancedOptions: EnhancedOptions = {
    findStep: (type) => mappedSteps[type],
  }

  return (
    <SdkOptionsContext.Provider value={[options, enhancedOptions]}>
      {children}
    </SdkOptionsContext.Provider>
  )
}

export const useSdkOptions = (): SdkOptionsContextType => {
  const options = useContext(SdkOptionsContext)

  if (!options) {
    throw new Error(`SDK options wasn't initialized!`)
  }

  return options
}
