import { h, Component } from 'preact'
import { AuthCheckProcessor } from './AuthCheckProcessor'
import { FaceTecSDK } from '../../../core-sdk/FaceTecSDK.js/FaceTecSDK'
import { Config } from './AuthConfig'
import { FaceTecStrings } from './assets/FaceTecStrings'

import type { WithLocalisedProps } from '~types/hocs'
import type { StepComponentBaseProps } from '~types/routers'

type State = {
  authConfig: {
    device_key_identifier?: string
    production_key_text?: string
    public_key?: string
    token?: string
  }
  sessionInit: boolean
  sessionState: string
}

type Props = StepComponentBaseProps & WithLocalisedProps

export default class AuthCapture extends Component<Props, State> {
  state: State = {
    authConfig: {},
    sessionInit: false,
    sessionState: 'Initializing...',
  }

  componentDidUpdate(_prevProps: Props, prevState: State): void {
    if (
      Object.keys(prevState.authConfig).length === 0 &&
      Object.keys(this.state.authConfig).length > 0 &&
      FaceTecSDK.getStatus() === 0
    ) {
      this.initFaceTec()
    }
  }

  componentDidMount(): void {
    console.log(FaceTecSDK.getStatus())
    if (FaceTecSDK.getStatus() === 0) {
      FaceTecSDK.setCustomization(Config.getAuthCustomization(false))
      FaceTecSDK.setDynamicDimmingCustomization(
        Config.getAuthCustomization(true)
      )
      this.getConfig()
    } else this.onLivenessCheckPressed()
  }

  initFaceTec = (): void => {
    FaceTecSDK.setResourceDirectory('../../../core-sdk/FaceTecSDK.js/resources')
    FaceTecSDK.setImagesDirectory('../../../core-sdk/FaceTec_images')
    const {
      production_key_text = '',
      device_key_identifier = '',
      public_key = '',
    } = this.state.authConfig

    FaceTecSDK.initializeInProductionMode(
      production_key_text,
      device_key_identifier,
      atob(public_key),
      (initializedSuccessfully) => {
        if (initializedSuccessfully) {
          FaceTecSDK.configureLocalization(FaceTecStrings(this.props.translate))
          this.setState({
            sessionState: 'Initialized successfuly',
            sessionInit: true,
          })
          this.onLivenessCheckPressed()
        }
      }
    )
  }

  getConfig = (): void => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${process.env.OLD_AUTH}/auth_3d/session`)
    xhr.setRequestHeader('Authorization', `Bearer ${this.props.token}`)
    xhr.setRequestHeader('Application-Id', 'com.onfido.onfidoAuth')
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const response = JSON.parse(xhr.responseText)
        return this.setState({
          authConfig: {
            ...response,
            production_key_text: JSON.parse(atob(response.production_key_text)),
          },
        })
      }
    }
    const body = {
      sdk_type: 'onfido_web_sdk',
    }
    xhr.send(JSON.stringify(body))
  }

  onLivenessCheckPressed = (): void => {
    if (this.state.authConfig.token) {
      new AuthCheckProcessor(
        this.state.authConfig.token,
        this.props.token,
        this.props.nextStep,
        this.props.events
      )
    }
  }

  render(): h.JSX.Element | null {
    return null
  }
}
