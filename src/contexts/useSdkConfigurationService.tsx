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
      .then((configuration) => {
        let mergedConfiguration = deepmerge(defaultConfiguration, configuration)

        if (process.env.NODE_ENV === 'development') {
          mergedConfiguration = deepmerge(
            mergedConfiguration,
            process.env.SDK_CONFIGURATION as SdkConfiguration
          )
        }

        setConfiguration(mergedConfiguration)
      })
      .catch(() => setConfiguration(defaultConfiguration))
  }, [url, token])

  return configuration ? (
    <SdkConfigurationServiceContext.Provider value={configuration}>
      {children}
    </SdkConfigurationServiceContext.Provider>
  ) : (
    <Fragment>{fallback}</Fragment>
  )
}

const useSdkConfigurationService = () => {
  return useContext(SdkConfigurationServiceContext)
}

export default useSdkConfigurationService
