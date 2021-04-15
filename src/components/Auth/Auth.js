import { h, Component } from 'preact'
import { AuthCheckProcessor } from './AuthCheckProcessor'
import { FaceTecSDK } from '../../../core-sdk/FaceTecSDK.js/FaceTecSDK'
import { Config } from './AuthConfig'

export default class AuthCapture extends Component {
  state = {
    latestSessionResult: String,
    latestIDScanResult: String,
    latestEnrollmentIdentifier: String,
    authConfig: Object,
    token: String,
    sessionState: String,
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
        if (initializedSuccessfully)
          this.setState({ sessionState: 'Initialized successfuly' })
      }
    )
  }

  componentDidMount() {
    // Call our own endpoint to get the session information regarding public production key and session token
    // Save session data from fetch in state and use as needed (i.e. handleSessionToken)
    // Production auth key text must be parsed with base64 and followed by JSON.parse

    FaceTecSDK.setCustomization(
      Config.retrieveConfigurationWizardCustomization(FaceTecSDK)
    )

    this.setState(
      {
        sessionState: 'Initializing...',
        token:
          'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE2MTg0ODk0NDUsInBheWxvYWQiOnsiYXBwIjoiYzljMmMyM2MtYzdiYi00ZTdlLWE5YzUtODk5NDUwYTZhNWMwIn0sInV1aWQiOiJCel81Z183SUxHQyIsInVybHMiOnsidGVsZXBob255X3VybCI6Imh0dHBzOi8vdGVsZXBob255Lm9uZmlkby5jb20iLCJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9zZGsub25maWRvLmNvbSIsInN5bmNfdXJsIjoiaHR0cHM6Ly9zeW5jLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQub25maWRvLmNvbSIsImF1dGhfdXJsIjoiaHR0cHM6Ly9lZGdlLmFwaS5vbmZpZG8uY29tIiwib25maWRvX2FwaV91cmwiOiJodHRwczovL2FwaS5vbmZpZG8uY29tIn19.MIGIAkIBWnh5pvK5nFVv8gceEjbe94koZyXmEjEK3BXLmFpx7LE07S0GZJxedrB2OGZdc0GfVjyUkKhTKhdzGFRH-DLx_WsCQgCTLugiVZ0u4odcRITy0D7XTwoxjuOW81qe4h4EpG6bCo9JPDtfDAYmITFmm77JOAIu8e3St3gLSN_8oDx0l2nnQA',
      },
      () => this.getConfig(this)
    )
    // Request for devicekeyidentifier to begin new session (from our own BE)
  }

  getConfig = (ref) => {
    const XHR = new XMLHttpRequest()
    XHR.open('POST', `${process.env.OLD_AUTH}/auth_3d/session`)
    XHR.setRequestHeader('Authorization', `Bearer ${this.state.token}`)
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
      const latestProcessor = new AuthCheckProcessor(
        this.state.authConfig.token,
        AuthCapture,
        this.state.token
      )
    }
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
            <p id="status">{String(this.state.sessionState)}</p>
          </div>
        </div>
      </div>
    )
  }
}
