import { h, Component} from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import { performHttpReq } from '~utils/http'
import Spinner from '../../Spinner'
import Error from '../../Error'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { localised } from '../../../locales'
import { createSocket } from '~utils/crossDeviceSync'

class SmsError extends Component {
  componentDidMount() {
     const errorName = this.props.error.name.toLowerCase()
     this.props.trackScreen([errorName])
   }
  render = ({error}) => <Error role="alert" {...{error}} />
}

class CrossDeviceLink extends Component {
  constructor(props) {
    super(props)

    if (!props.socket) {
      const url = props.urls.sync_url
      const socket = createSocket(url)
      socket.on('connect', () => {
        const roomId = this.props.roomId || null
        socket.emit('join', {roomId})
      })
      socket.on('joined', this.onJoined)
      socket.open()
      props.actions.setSocket(socket)
    }
  }

  componentDidMount() {
    this.listen(this.props.socket)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socket !== this.props.socket) {
      this.unlisten(this.props.socket)
      this.listen(nextProps.socket)
    }
  }

  componentWillUnmount() {
    this.unlisten(this.props.socket)
  }

  unlisten = (socket) => {
    if (!socket) return
    socket.off('get config', this.onGetConfig)
    socket.off('client success', this.onClientSuccess)
  }

  listen = (socket) => {
    if (!socket) return
    socket.on('get config', this.onGetConfig)
    socket.on('client success', this.onClientSuccess)
  }

  onJoined = (data) => {
    const {actions, roomId} = this.props
    if (!roomId) {
      actions.setRoomId(data.roomId)
    }
  }

  onGetConfig = (data) => {
    const { roomId, mobileConfig, socket, actions, nextStep } = this.props
    if (roomId && roomId !== data.roomId) {
      socket.emit('leave', {roomId})
    }
    actions.mobileConnected(true)
    this.sendMessage('config', data.roomId, mobileConfig)
    nextStep()
  }

  onClientSuccess = () => {
    const {actions} = this.props
    actions.setClientSuccess(true)
    this.props.nextStep()
  }

  sendMessage = (event, roomId, payload) => {
    this.props.socket.emit('message', {event, payload, roomId})
  }

  render = () =>
    this.props.roomId ? <CrossDeviceLinkUI {...this.props}/> : <Spinner />
}

class CrossDeviceLinkUI extends Component {
  constructor(props) {
    super(props)
    this.state = {
      copySuccess: false,
      sending: false,
      error: {},
      validNumber: true
    }
  }

  linkId = `${process.env.BASE_32_VERSION}${this.props.roomId}`

  linkCopiedTimeoutId = null

  onCopySuccess = () => {
    this.setState({copySuccess: true})
    this.clearLinkCopiedTimeout()
    this.linkCopiedTimeoutId = setTimeout(() => {
      this.setState({copySuccess: false})

      // move focus away from Copy button to prevent screen readers announcing
      // text changing back from "Copied" to "Copy"
      this.linkText.focus()
    }, 5000)
  }

  clearLinkCopiedTimeout = () => {
    if (this.linkCopiedTimeoutId) {
      clearTimeout(this.linkCopiedTimeoutId)
    }
  }

  setError = (name) => this.setState({error: {name, type: 'error'}})

  clearErrors = () => {
    this.clearSendLinkClickTimeout()
    this.setState({
      error: {},
      validNumber: true
    })
  }

  handleResponse = (response) => {
    this.clearSendLinkClickTimeout()
    this.setState({sending: false})
    if (response.status === "OK") {
      this.props.nextStep()
    }
    else {
      this.setError('SMS_FAILED')
    }
  }

  handleSMSError = (error) => {
    this.clearSendLinkClickTimeout()
    this.setState({sending: false})
    this.props.triggerOnError(error)
    status === 429 ? this.setError('SMS_OVERUSE') : this.setError('SMS_FAILED')
  }

  handleSendLinkClick = () => {
    if (!this.props.sms.valid) {
      this.clearSendLinkClickTimeout()
      this.setState({validNumber: false})
    } else if (!this.sendLinkClickTimeoutId) {
      this.sendLinkClickTimeoutId = setTimeout(this.sendSms, 500);
    }
  }

  sendSms = () => {
    this.setState({sending: true})
    // add a quick note that this will send a production SMS, so non-production
    // environment users will need to amend any URLs that they receive.
    if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
      alert(`An SMS will be sent, but the link in it will be to production, not to ${window.location.origin}`)
    }
    // On staging, inform devs that sms will not be sent and link must be copy-pasted
    if (process.env.NODE_ENV === 'staging') {
      alert(`No SMS will be sent, please copy this link ${window.location.origin}`)
    }

    const { language, sms, token, urls } = this.props
    const url = urls.telephony_url
    const options = {
      payload: JSON.stringify({to: sms.number, id: this.linkId, language}),
      endpoint: `${url}/v1/cross_device_sms`,
      contentType: 'application/json',
      token: `Bearer ${token}`
    }
    performHttpReq(options, this.handleResponse , this.handleSMSError)
  }

  mobileUrl = ({hosted_sdk_url}) =>
    // This lets us test the cross device flow locally and on surge.
    // We use the same location to test the same bundle as the desktop flow.
    process.env.MOBILE_URL === "/" ?
      `${window.location.origin}?link_id=${this.linkId}` :
      `${hosted_sdk_url}/${this.linkId}`

  clearSendLinkClickTimeout() {
    if (this.sendLinkClickTimeoutId) {
      clearTimeout(this.sendLinkClickTimeoutId)
    }
  }

  componentWillUnmount() {
    this.clearSendLinkClickTimeout()
  }

  render() {
    const { urls, translate, trackScreen } = this.props
    const mobileUrl = this.mobileUrl(urls)
    const error = this.state.error
    return (
      <div className={style.container}>
        { error.type ?
          <SmsError error={error} trackScreen={trackScreen}/> :
          <PageTitle title={translate('cross_device.link.title')} /> }
        <div className={theme.thickWrapper}>
          <p>Please scan your QR Code with your phone</p>
          <img src={
            "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + mobileUrl
          }/>
          <p>Point your mobile camera app to the square</p>
        </div>
      </div>
    )
  }
}

export default trackComponent(localised(CrossDeviceLink), 'crossdevice_link')
