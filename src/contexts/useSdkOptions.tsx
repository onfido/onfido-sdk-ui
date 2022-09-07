import { h, createContext, FunctionComponent } from 'preact'
import { useContext, useEffect } from 'preact/compat'
import { buildStepFinder, FindStepCallback } from '~utils/steps'

import type { NarrowSdkOptions } from '~types/commons'
import { useDispatch } from 'react-redux'
import { setSDKOptions } from 'components/ReduxAppWrapper/store/actions/globals'

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
  const dispatch = useDispatch()
  const { steps } = options

  const enhancedOptions: EnhancedOptions = {
    findStep: buildStepFinder(steps),
  }

  useEffect(() => {
    dispatch(setSDKOptions(options))
  }, [])

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
