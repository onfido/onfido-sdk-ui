import { h, FunctionComponent } from 'preact'
import { AuthCheckProcessor } from './AuthCheckProcessor'
import { FaceTecSDK } from '~auth-sdk/FaceTecSDK.js/FaceTecSDK'
import { getAuthCustomization, getAuthConfig } from './AuthConfig'
import { FaceTecStrings } from './assets/FaceTecStrings'
import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'
import { useCallback, useEffect, useState } from 'preact/hooks'
import Loader from './assets/loaderSvg'
import style from './style.scss'
import { useLocales } from '~locales'
import { useSdkOptions } from '~contexts'

type Props = StepComponentBaseProps & WithLocalisedProps

type AuthConfigType = {
  token: string
  production_key_text: string
  device_key_identifier: string
  public_key: string
}

const AuthCapture: FunctionComponent<Props> = (props) => {
  const [, { findStep }] = useSdkOptions()
  const { translate } = useLocales()
  const retries = findStep('auth')?.options?.retries || 3
  const apiUrl = props.urls.onfido_api_url

  const [authConfig, setAuthConfig] = useState<AuthConfigType>({
    token: '',
    production_key_text: '',
    device_key_identifier: '',
    public_key: '',
  })
  const [sessionInit, setSessionInit] = useState(false)

  const onLivenessCheckPressed = useCallback(() => {
    if (authConfig.token && props.token && props.nextStep) {
      new AuthCheckProcessor(
        apiUrl,
        authConfig,
        retries,
        props.token,
        props.nextStep,
        props.back,
        props.events
      )
    }
  }, [
    authConfig,
    props.back,
    props.events,
    props.nextStep,
    props.token,
    retries,
    apiUrl,
  ])

  useEffect(() => {
    const initFaceTec = () => {
      const authAlias = `../../../auth-sdk/FaceTec/`
      FaceTecSDK.setResourceDirectory(`${authAlias}FaceTecSDK.js/resources`)
      FaceTecSDK.setImagesDirectory(`${authAlias}FaceTec_images`)
      const {
        production_key_text,
        device_key_identifier,
        public_key,
      } = authConfig
      FaceTecSDK.initializeInProductionMode(
        production_key_text,
        device_key_identifier,
        atob(public_key),
        (initializedSuccessfully: boolean) => {
          if (initializedSuccessfully) {
            FaceTecSDK.configureLocalization(FaceTecStrings(translate))
            setSessionInit(true)
            onLivenessCheckPressed()
          }
        }
      )
    }
    const getConfig = () => {
      getAuthConfig(
        apiUrl,
        `Bearer ${props.token}`,
        (success) => {
          const response = JSON.parse(success)
          setAuthConfig({
            ...response,
            production_key_text: JSON.parse(atob(response.production_key_text)),
          })
        },
        (error) => {
          if (error.status !== 200 && error.status !== 201)
            console.error(error.response)
        }
      )
    }

    if (FaceTecSDK.getStatus() === 1) {
      setSessionInit(true)
    }
    if (FaceTecSDK.getStatus() === 0 && !sessionInit) {
      FaceTecSDK.setCustomization(
        getAuthCustomization(false, props.customUI || {})
      )
      FaceTecSDK.setDynamicDimmingCustomization(
        getAuthCustomization(true, props.customUI || {})
      )
      if (authConfig.token && !sessionInit) {
        initFaceTec()
      } else {
        getConfig()
      }
    } else if (authConfig.token.length === 0) {
      getConfig()
    }
  }, [
    sessionInit,
    authConfig,
    translate,
    onLivenessCheckPressed,
    props.token,
    props.customUI,
    apiUrl,
  ])

  useEffect(() => {
    if (authConfig.token && sessionInit) {
      onLivenessCheckPressed()
    }
  }, [authConfig.token, onLivenessCheckPressed, sessionInit])

  return (
    <div className={style.loading}>
      <Loader />
    </div>
  )
}

export default AuthCapture
