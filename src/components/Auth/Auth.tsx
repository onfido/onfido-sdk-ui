import { h, FunctionComponent } from 'preact'
import { AuthCheckProcessor } from './AuthCheckProcessor'
import { FaceTecSDK } from '~auth-sdk/FaceTecSDK.js/FaceTecSDK'
import { Config } from './AuthConfig'
import { FaceTecStrings } from './assets/FaceTecStrings'
import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'
import { useEffect, useState } from 'preact/hooks'
import Loader from './assets/loaderSvg'
import style from './style.scss'

type Props = StepComponentBaseProps & WithLocalisedProps

type AuthConfigType = {
  token: string
  production_key_text: string
  device_key_identifier: string
  public_key: string
}

const AuthCapture: FunctionComponent<Props> = (props) => {
  const [authConfig, setAuthConfig] = useState<AuthConfigType>({
    token: '',
    production_key_text: '',
    device_key_identifier: '',
    public_key: '',
  })
  const [sessionInit, setSessionInit] = useState(false)

  useEffect(() => {
    if (FaceTecSDK.getStatus() === 1) setSessionInit(true)
    if (FaceTecSDK.getStatus() === 0 && !sessionInit) {
      FaceTecSDK.setCustomization(
        Config.getAuthCustomization(false, props.customUI || {})
      )
      FaceTecSDK.setDynamicDimmingCustomization(
        Config.getAuthCustomization(true, props.customUI || {})
      )
      if (authConfig.token && !sessionInit) initFaceTec()
      else getConfig()
    } else if (authConfig.token.length === 0) {
      getConfig()
    }
  })

  useEffect(() => {
    if (authConfig.token && sessionInit) onLivenessCheckPressed()
  }, [authConfig.token])

  const initFaceTec = () => {
    const authAlias = '../../../../auth-sdk/FaceTec/'
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
          FaceTecSDK.configureLocalization(FaceTecStrings(props.translate))
          setSessionInit(true)
          onLivenessCheckPressed()
        }
      }
    )
  }

  const getConfig = () => {
    const XHR = new XMLHttpRequest()
    XHR.open('POST', `${process.env.AUTH_URL}/auth_3d/session`)
    XHR.setRequestHeader('Authorization', `Bearer ${props.token}`)
    XHR.setRequestHeader('Application-Id', 'com.onfido.onfidoAuth')
    XHR.setRequestHeader('Content-Type', 'application/json')
    XHR.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        const response = JSON.parse(this.responseText)
        return setAuthConfig({
          ...response,
          production_key_text: JSON.parse(atob(response.production_key_text)),
        })
      }
    }
    const body = {
      sdk_type: 'onfido_web_sdk',
    }
    XHR.send(JSON.stringify(body))
  }

  const onLivenessCheckPressed = () => {
    if (authConfig.token && props.token && props.nextStep) {
      new AuthCheckProcessor(
        authConfig,
        props.token,
        props.nextStep,
        props.back,
        props.events
      )
    }
  }

  return (
    <div className={style.loading}>
      <Loader />
    </div>
  )
}

export default AuthCapture
