import { h, createContext, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import { NormalisedSdkOptions } from '~types/commons'

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

const useSdkOptions = (): NormalisedSdkOptions => {
  const options = useContext(SdkOptionsContext)

  if (!options) {
    throw new Error(`SDK options wasn't initialized!`)
  }

  return options
}

export default useSdkOptions
