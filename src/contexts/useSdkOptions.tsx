import { h, createContext, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import type { NormalisedSdkOptions } from '~types/commons'
import type { StepTypes } from '~types/steps'

const SdkOptionsContext = createContext<NormalisedSdkOptions>(null)

type Props = {
  options: NormalisedSdkOptions
}

export const SdkOptionsProvider: FunctionComponent<Props> = ({
  children,
  options,
}) => {
  return (
    <SdkOptionsContext.Provider value={options}>
      {children}
    </SdkOptionsContext.Provider>
  )
}

export const useSdkOptions = (
  filterByStep: StepTypes
): NormalisedSdkOptions => {
  const options = useContext(SdkOptionsContext)

  if (!options) {
    throw new Error(`SDK options wasn't initialized!`)
  }

  return options
}
