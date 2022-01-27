import { getSdkConfiguration } from '~utils/onfidoApi'
import { useContext, useEffect, useState } from 'preact/compat'
import { h, ComponentChildren, createContext, Fragment } from 'preact'
import { SdkConfiguration } from '~types/api'

type SdkConfigurationServiceProviderProps = {
  children: ComponentChildren
  url?: string
  token?: string
  fallback?: ComponentChildren
}

const SdkConfigurationServiceContext = createContext<SdkConfiguration>({})

export const SdkConfigurationServiceProvider = ({
  children,
  url,
  token,
  fallback,
}: SdkConfigurationServiceProviderProps) => {
  const [settings, setSettings] = useState<SdkConfiguration | undefined>(
    undefined
  )

  useEffect(() => {
    if (!url || !token) {
      return
    }
    getSdkConfiguration(url, token).then(setSettings)
  }, [url, token])

  return settings ? (
    <SdkConfigurationServiceContext.Provider value={settings}>
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
