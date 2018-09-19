import { h, Component } from 'preact'
import Spinner from '../Spinner'
import GenericError from '../crossDevice/GenericError'
import { themeWrap } from '../Theme'
import io from 'socket.io-client'
import { jwtExpired } from '../utils/jwt'
import { getWoopraCookie, setWoopraCookie, sendError } from '../../Tracker'

const WrappedSpinner = themeWrap(Spinner)
const WrappedError = themeWrap(GenericError)

const withCrossDeviceClient = (WrappedComponent) => {
  return class Client extends Component {
    constructor(props) {
      super(props)
      // Some environments put the link ID in the query string so they can serve
      // the cross device flow without running nginx
      const searchParams = new URLSearchParams(window.location.search)
      const roomId = window.location.pathname.substring(3) ||
        searchParams.get('link_id').substring(2)
      this.state = {
        token: null,
        steps: null,
        step: null,
        i18n: initializeI18n(),
        socket: io(process.env.DESKTOP_SYNC_URL, {autoConnect: false}),
        roomId,
        crossDeviceError: false,
        loading: true,
      }
      this.state.socket.on('config', this.setConfig(props.actions))
      this.state.socket.on('connect', () => {
        this.state.socket.emit('join', {roomId: this.state.roomId})
      })
      this.state.socket.open()
      this.requestConfig()
    }

    configTimeoutId = null
    pingTimeoutId = null

    componentDidMount() {
      this.state.socket.on('custom disconnect', this.onDisconnect)
      this.state.socket.on('disconnect pong', this.onDisconnectPong)
    }

    componentWillUnmount() {
      this.clearConfigTimeout()
      this.clearPingTimeout()
      this.state.socket.close()
    }

    sendMessage = (event, payload) => {
      const roomId = this.state.roomId
      this.state.socket.emit('message', {roomId, event, payload})
    }

    requestConfig = () => {
      this.sendMessage('get config')
      this.clearConfigTimeout()
      this.configTimeoutId = setTimeout(() => {
        if (this.state.loading) this.setError()
      }, 10000)
    }

    clearConfigTimeout = () =>
      this.configTimeoutId && clearTimeout(this.configTimeoutId)

    clearPingTimeout = () => {
      if (this.pingTimeoutId) {
        clearTimeout(this.pingTimeoutId)
        this.pingTimeoutId = null
      }
    }

    setConfig = (actions) => (data) => {
      const {token, steps, language, documentType, step, woopraCookie} = data
      setWoopraCookie(woopraCookie)
      if (!token) {
        console.error('Desktop did not send token')
        sendError('Desktop did not send token')
        return this.setError()
      }
      if (jwtExpired(token)) {
        console.error('Desktop token has expired')
        sendError(`Token has expired: ${token}`)
        return this.setError()
      }
      this.setState({token, steps, step, loading: false, crossDeviceError: false, i18n: initializeI18n(language)})
      actions.setDocumentType(documentType)
      actions.acceptTerms()
    }

    setError = () =>
      this.setState({crossDeviceError: true, loading: false})

    onDisconnect = () => {
      this.pingTimeoutId = setTimeout(this.setError, 3000)
      this.sendMessage('disconnect ping')
    }

    onDisconnectPong = () =>
      this.clearPingTimeout()

    onStepChange = step => {
      this.setState({step})
    }

    sendClientSuccess = () => {
      this.state.socket.off('custom disconnect', this.onDisconnect)
      const faceCapture = this.props.captures.face[0]
      const data = faceCapture ? {faceCapture: {blob: null, ...faceCapture}} : {}
      this.sendMessage('client success', data)
    }

    render = (props) =>
      this.state.loading ? <WrappedSpinner i18n={this.state.i18n} disableNavigation={true} /> :
        this.state.crossDeviceError ? <WrappedError i18n={this.state.i18n} disableNavigation={true} /> :
          <WrappedComponent
            {...props}
            {...this.state}
            onStepChange={this.onStepChange}
            sendClientSuccess={this.sendClientSuccess}
            crossDeviceClientError={this.setError}
          />
  }
}

export default withCrossDeviceClient


