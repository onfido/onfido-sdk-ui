import { h, createContext, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'
import { buildStepFinder, FindStepCallback } from '~utils/steps'

import type { NarrowSdkOptions } from '~types/commons'

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

  const enhancedOptions: EnhancedOptions = {
    findStep: buildStepFinder(steps),
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
