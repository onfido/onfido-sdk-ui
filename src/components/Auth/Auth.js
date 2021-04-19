import { h, Component } from 'preact'
import { AuthCheckProcessor } from './AuthCheckProcessor'
import { FaceTecSDK } from '../../../core-sdk/FaceTecSDK.js/FaceTecSDK'
import { Config } from './AuthConfig'
import { FaceTecStrings } from './assets/FaceTecStrings'
import { Button } from '@onfido/castor-react'

export default class AuthCapture extends Component {
  state = {
    authConfig: {},
    sessionInit: false,
    sessionState: 'Initializing...',
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      Object.keys(prevState.authConfig).length === 0 &&
      Object.keys(this.state.authConfig).length > 0
    ) {
      this.initFaceTec()
    }
  }

  initFaceTec = () => {
    FaceTecSDK.setResourceDirectory('../../../core-sdk/FaceTecSDK.js/resources')
    FaceTecSDK.setImagesDirectory('../../../core-sdk/FaceTec_images')
    const {
      production_key_text,
      device_key_identifier,
      public_key,
    } = this.state.authConfig
    console.log('trying to init...')
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
        }
      }
    )
  }

  componentDidMount() {
    FaceTecSDK.setCustomization(Config.getAuthCustomization(FaceTecSDK, false))
    FaceTecSDK.setDynamicDimmingCustomization(
      Config.getAuthCustomization(FaceTecSDK, true)
    )
    this.getConfig(this)
  }

  getConfig = (ref) => {
    const XHR = new XMLHttpRequest()
    XHR.open('POST', `${process.env.OLD_AUTH}/auth_3d/session`)
    XHR.setRequestHeader('Authorization', `Bearer ${this.props.token}`)
    XHR.setRequestHeader('Application-Id', 'com.onfido.onfidoAuth')
    XHR.setRequestHeader('Content-Type', 'application/json')
    XHR.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        const response = JSON.parse(this.responseText)
        return ref.setState({
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
    XHR.send(JSON.stringify(body))
  }

  onLivenessCheckPressed = () => {
    if (this.state.authConfig.token) {
      new AuthCheckProcessor(
        this.state.authConfig.token,
        this.props.token,
        this.props.nextStep,
        this.props.events
      )
    }
  }

  render() {
    return (
      <div>
        <div className="wrapping-box-container">
          <div id="controls" className="controls">
            <Button
              disabled={!this.state.sessionInit}
              id="liveness-button"
              variant="primary"
              kind="action"
              onClick={() => this.onLivenessCheckPressed()}
            >
              {this.props.translate('auth_intro.button')}
            </Button>
            <p id="status">{String(this.state.sessionState)}</p>
          </div>
        </div>
      </div>
    )
  }
}
