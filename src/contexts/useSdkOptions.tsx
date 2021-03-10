import { h, createContext, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import type { NarrowSdkOptions } from '~types/commons'

const SdkOptionsContext = createContext<NarrowSdkOptions>(null)

type Props = {
  options: NarrowSdkOptions
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

export const useSdkOptions = (): NarrowSdkOptions => {
  const options = useContext(SdkOptionsContext)

  if (!options) {
    throw new Error(`SDK options wasn't initialized!`)
  }

  return options
}
