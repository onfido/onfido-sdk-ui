import { getSdkConfiguration } from './getSdkConfiguration'
import { useEffect, useState } from 'preact/compat'
import { h, ComponentChildren, Fragment, ComponentType } from 'preact'
import { SdkConfiguration } from './types'
import { ParsedError, ErrorCallback } from '~types/api'
import deepmerge from 'deepmerge'
import withTheme from '../../components/Theme'
import GenericError from '../../components/GenericError'
import { connect, useDispatch, useSelector } from 'react-redux'
import { defaultConfiguration } from './config'
import { setSdkConfiguration } from 'components/ReduxAppWrapper/store/actions/globals'
import { RootState } from '~types/redux'

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

export const SdkConfigurationServiceProvider = ({
  children,
  url,
  token,
  fallback,
  triggerOnError,
  overrideConfiguration,
}: SdkConfigurationServiceProviderProps) => {
  const dispatch = useDispatch()
  const [error, setError] = useState<ParsedError | undefined>(undefined)
  const configuration = useSelector(
    (store: RootState) => store.globals.sdkConfiguration
  )

  useEffect(() => {
    if (!url || !token) {
      return
    }
    getSdkConfiguration(url, token)
      .then((apiConfiguration: Partial<SdkConfiguration>) => {
        const config = deepmerge(
          deepmerge(defaultConfiguration, apiConfiguration),
          // TODO: Cleanup the overrideConfigurationState and add it to the mock server
          process.env.NODE_ENV === 'production' || !overrideConfiguration
            ? {}
            : overrideConfiguration
        )
        dispatch(setSdkConfiguration(config))
      })
      .catch((error: ParsedError) => {
        triggerOnError(error)
        setError(error)
      })
  }, [url, token, overrideConfiguration])

  if (error && error.status === 401) {
    return <WrappedError error={{ name: 'EXPIRED_TOKEN' }} disableNavigation />
  }

  if (!configuration) {
    return <Fragment>{fallback}</Fragment>
  }

  return <Fragment>{children}</Fragment>
}

const useSdkConfigurationService = () =>
  useSelector(
    (store: RootState) => store.globals.sdkConfiguration
  ) as SdkConfiguration

export type SDKConfigurationServiceProps = {
  sdkConfiguration: SdkConfiguration
}

export const withSdkConfigurationService = <P,>(
  WrapperComponent: ComponentType<P & SDKConfigurationServiceProps>
) => {
  const mapStateToProps = (store: RootState, props: P) => ({
    ...props,
    sdkConfiguration: store.globals.sdkConfiguration,
  })

  // @ts-ignore
  return connect(mapStateToProps)(WrapperComponent)
}

export default useSdkConfigurationService
