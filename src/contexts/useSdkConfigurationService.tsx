import { getSdkConfiguration } from '~utils/onfidoApi'
import { useContext, useEffect, useState } from 'preact/compat'
import { h, ComponentChildren, createContext } from 'preact'
import { SdkConfiguration } from '~types/api'

type SdkConfigurationServiceProviderProps = {
  children: ComponentChildren
  url?: string
  token?: string
  sdkVersion?: string
}

const SdkConfigurationServiceContext = createContext<
  SdkConfiguration | undefined
>(undefined)

export const SdkConfigurationServiceProvider = ({
  children,
  url,
  token,
  sdkVersion,
}: SdkConfigurationServiceProviderProps) => {
  const [settings, setSettings] = useState<SdkConfiguration | undefined>(
    undefined
  )

  useEffect(() => {
    if (!url || !token || !sdkVersion) {
      return
    }
    getSdkConfiguration(url, token, sdkVersion)
      .then((res) => setSettings(res))
      .catch(() => setSettings({}))
  }, [url, token, sdkVersion])

  return settings ? (
    <SdkConfigurationServiceContext.Provider value={settings}>
      {children}
    </SdkConfigurationServiceContext.Provider>
  ) : null
}

const useSdkConfigurationService = () => {
  const configuration = useContext(SdkConfigurationServiceContext)

  if (!configuration) {
    throw new Error(`SDK Configuration wasn't initialized!`)
  }

  return configuration
}

export default useSdkConfigurationService
