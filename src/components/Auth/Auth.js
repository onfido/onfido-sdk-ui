import { h, Component } from 'preact'
import { AuthCheckProcessor } from './AuthCheckProcessor'
import { FaceTecSDK } from '../../../core-sdk/FaceTecSDK.js/FaceTecSDK'

// type State = {
//   latestSessionResult: String,
//   latestIDScanResult: String,
//   latestEnrollmentIdentifier: String
// }

export default class AuthCapture extends Component {
  state = {
    latestSessionResult: String,
    latestIDScanResult: String,
    latestEnrollmentIdentifier: String,
    authConfig: Object,
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
    FaceTecSDK.initializeInProductionMode(
      production_key_text,
      device_key_identifier,
      atob(public_key),
      (initializedSuccessfully) => {
        if (initializedSuccessfully) console.log('initialized successfuly')
      }
    )
  }

  componentDidMount() {
    // Call our own endpoint to get the session information regarding public production key and session token
    // Save session data from fetch in state and use as needed (i.e. handleSessionToken)
    // Production auth key text must be parsed with base64 and followed by JSON.parse
    this.getConfig(this)
    // Request for devicekeyidentifier to begin new session (from our own BE)
  }

  getConfig = (ref) => {
    const token = this.props.token
    const XHR = new XMLHttpRequest()
    XHR.open('POST', `${process.env.OLD_AUTH}/auth_3d/session`)
    XHR.setRequestHeader('Authorization', `Bearer ${token}`)
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
    this.handleSessionToken(this)
  }

  onServerSessionTokenError = () => {
    console.log('error')
  }

  setLatestSessionResult = (sessionResult) => {
    this.setState({ latestSessionResult: sessionResult })
  }

  setIDScanResult = (idScanResult) => {
    this.setState({ latestIDScanResult: idScanResult })
  }

  onComplete = () => {
    this.setState({ latestEnrollmentIdentifier: '' })
  }

  getLatestEnrollmentIdentifier = () => {
    return this.state.latestEnrollmentIdentifier
  }

  setLatestServerResult = (responseJSON) => {}

  handleSessionToken = (ref) => {
    const token = this.props.token
    /*
    check where sdk_token is being generated and bring it here

    get session from auth_3d/session, this will provide values of device key id, production key text, public_key,
    success & token (this token is assumingly the session token on line 80 
    */
    const XHR = new XMLHttpRequest()
    XHR.open('POST', `${process.env.OLD_AUTH}/auth_3d/session`)
    XHR.setRequestHeader('Authorization', `Bearer ${token}`)
    XHR.setRequestHeader('Application-Id', 'com.onfido.onfidoAuth')
    XHR.setRequestHeader('Content-Type', 'application/json')
    XHR.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        const response = JSON.parse(this.responseText)
        console.log(response)
      }
    }
    const body = {
      sdk_type: 'onfido_web_sdk',
    }
    XHR.send(JSON.stringify(body))
  }
  render() {
    return (
      <div>
        <div className="wrapping-box-container">
          <div id="controls" className="controls">
            <button
              id="liveness-button"
              className="big-button"
              onClick={() => this.onLivenessCheckPressed()}
            >
              3D Liveness Check
            </button>
            <p id="status">Initializing...</p>
          </div>
        </div>
      </div>
    )
  }
}
