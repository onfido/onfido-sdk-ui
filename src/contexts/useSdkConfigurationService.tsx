import { getSdkConfiguration } from '~utils/onfidoApi'
import { useContext, useEffect, useState } from 'preact/compat'
import { h, ComponentChildren, createContext, Fragment } from 'preact'
import { SdkConfiguration } from '~types/api'
import deepmerge from 'deepmerge'

type SdkConfigurationServiceProviderProps = {
  children: ComponentChildren
  url?: string
  token?: string
  fallback?: ComponentChildren
}

const defaultConfiguration: SdkConfiguration = {}
const envConfiguration = process.env.SDK_CONFIGURATION as SdkConfiguration

const SdkConfigurationServiceContext = createContext<SdkConfiguration>(
  defaultConfiguration
)

export const SdkConfigurationServiceProvider = ({
  children,
  url,
  token,
  fallback,
}: SdkConfigurationServiceProviderProps) => {
  const [configuration, setConfiguration] = useState<
    SdkConfiguration | undefined
  >(undefined)

  useEffect(() => {
    if (!url || !token) {
      return
    }
    getSdkConfiguration(url, token)
      .then((configuration) =>
        setConfiguration(
          deepmerge(
            deepmerge(defaultConfiguration, configuration),
            envConfiguration
          )
        )
      )
      .catch(() => setConfiguration(defaultConfiguration))
  }, [url, token])

  if (!configuration) {
    return <Fragment>{fallback}</Fragment>
  }

  return (
    <SdkConfigurationServiceContext.Provider value={configuration}>
      {children}
    </SdkConfigurationServiceContext.Provider>
  )
}

const useSdkConfigurationService = () => {
  return useContext(SdkConfigurationServiceContext)
}

export default useSdkConfigurationService
