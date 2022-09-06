import { getSdkConfiguration } from '~utils/onfidoApi'
import { useContext, useEffect, useState } from 'preact/compat'
import {
  h,
  ComponentChildren,
  createContext,
  Fragment,
  ComponentType,
} from 'preact'
import { ParsedError, SdkConfiguration, ErrorCallback } from '~types/api'
import deepmerge from 'deepmerge'
import withTheme from '../components/Theme'
import GenericError from '../components/GenericError'

type SdkConfigurationServiceProviderProps = {
  children: ComponentChildren
  url?: string
  token?: string
  fallback?: ComponentChildren
  overrideConfiguration?: Partial<SdkConfiguration>
  triggerOnError: ErrorCallback
}

// Wrap components with theme that include navigation and footer
const WrappedError = withTheme(GenericError)

const defaultConfiguration: SdkConfiguration = {
  experimental_features: {
    enable_multi_frame_capture: false,
    motion_experiment: {
      enabled: false,
    },
  },
  sdk_features: {
    enable_require_applicant_consents: true,
    disable_cross_device_sms: false,
  },
  document_capture: {
    max_total_retries: 1,
  },
}

export const SdkConfigurationServiceContext = createContext<SdkConfiguration>(
  defaultConfiguration
)

export const SdkConfigurationServiceProvider = ({
  children,
  url,
  token,
  fallback,
  triggerOnError,
  overrideConfiguration,
}: SdkConfigurationServiceProviderProps) => {
  const [error, setError] = useState<ParsedError | undefined>(undefined)
  const [configuration, setConfiguration] = useState<
    SdkConfiguration | undefined
  >(undefined)

  useEffect(() => {
    if (!url || !token) {
      return
    }
    getSdkConfiguration(url, token)
      .then((apiConfiguration) =>
        setConfiguration(
          deepmerge(
            deepmerge(defaultConfiguration, apiConfiguration),
            // TODO: Cleanup the overrideConfigurationState and add it to the mock server
            process.env.NODE_ENV === 'production' || !overrideConfiguration
              ? {}
              : overrideConfiguration
          )
        )
      )
      .catch((error: ParsedError) => {
        triggerOnError(error)
        setError(error)
        setConfiguration(defaultConfiguration)
      })
  }, [url, token, overrideConfiguration])

  if (error && error.status === 401) {
    return <WrappedError error={{ name: 'EXPIRED_TOKEN' }} disableNavigation />
  }

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

export type SDKConfigurationServiceProps = {
  sdkConfiguration: SdkConfiguration
}

export const withSdkConfigurationService = <P,>(
  WrapperComponent: ComponentType<P & SDKConfigurationServiceProps>
): ComponentType<P> =>
  function SDKConfigurationWrapper(props) {
    return (
      <SdkConfigurationServiceContext.Consumer>
        {(sdkConfiguration) => (
          <WrapperComponent {...props} sdkConfiguration={sdkConfiguration} />
        )}
      </SdkConfigurationServiceContext.Consumer>
    )
  }

export default useSdkConfigurationService
