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
    const token =
      'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE2MTc2NDY2ODksInBheWxvYWQiOnsiYXBwIjoiNmM0NDYzNTktMDJiOC00MDkxLWIzNGMtMjk5NzEzNTQ1OWM0IiwiYXBwbGljYXRpb25faWQiOiJjb20ub25maWRvLk9uZmlkb0F1dGgiLCJyZWYiOiIqIn0sInV1aWQiOiJCel81Z183SUxHQyIsInVybHMiOnsidGVsZXBob255X3VybCI6Imh0dHBzOi8vdGVsZXBob255Lm9uZmlkby5jb20iLCJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9zZGsub25maWRvLmNvbSIsInN5bmNfdXJsIjoiaHR0cHM6Ly9zeW5jLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQub25maWRvLmNvbSIsImF1dGhfdXJsIjoiaHR0cHM6Ly9lZGdlLmFwaS5vbmZpZG8uY29tIiwib25maWRvX2FwaV91cmwiOiJodHRwczovL2FwaS5vbmZpZG8uY29tIn19.MIGIAkIA-N_jWE9XQlOysfrde1bOYT9fFE8Az9noFmTMwvPUFdHnPoIYL0CepfC_Ftt3ircRzoWms2va3YMonokCzCA-CbECQgDLxo2dVbo7iP5aXB6JhYxAVmwP0GAIUeWfvdgJK6cTNJ9MP1usO3Ee5MYOvpTBFmuwxyr_okAJelCIEbIIZ56s_g'
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
    // this.handleSessionToken(this)
    if (this.state.authConfig.token) {
      const latestProcessor = new AuthCheckProcessor(
        this.state.authConfig.token,
        AuthCapture,
        this.props.token
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

  handleSessionToken = (sessionTokenCallback) => {
    const token =
      'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE2MTc2MzI4NTYsInBheWxvYWQiOnsiYXBwIjoiNmM0NDYzNTktMDJiOC00MDkxLWIzNGMtMjk5NzEzNTQ1OWM0IiwiYXBwbGljYXRpb25faWQiOiJjb20ub25maWRvLk9uZmlkb0F1dGgiLCJyZWYiOiIqIn0sInV1aWQiOiJCel81Z183SUxHQyIsInVybHMiOnsidGVsZXBob255X3VybCI6Imh0dHBzOi8vdGVsZXBob255Lm9uZmlkby5jb20iLCJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9zZGsub25maWRvLmNvbSIsInN5bmNfdXJsIjoiaHR0cHM6Ly9zeW5jLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQub25maWRvLmNvbSIsImF1dGhfdXJsIjoiaHR0cHM6Ly9lZGdlLmFwaS5vbmZpZG8uY29tIiwib25maWRvX2FwaV91cmwiOiJodHRwczovL2FwaS5vbmZpZG8uY29tIn19.MIGIAkIBWH62eaW0wiRLwvEI0xFL-W4q74KkKAgDuJhLOJBoHS4KYCBglTM5Jrre7dKTB_gVPgsU_6ZfcC2qP_BMc8W6OGICQgHtoehcuVuxF25KQjBDAzDXuNEShvKIgpWVpjRl7TkRVD_e1T_GDDyld8c3YVG_m-JvAJfw2aJ_7_KfYA4SLRqzxQ'

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
    sessionTokenCallback()
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
