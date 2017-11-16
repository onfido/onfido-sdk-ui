import { h, Component} from 'preact'
import classNames from 'classnames'
import io from 'socket.io-client'

import theme from '../../Theme/style.css'
import style from './style.css'
import { performHttpReq } from '../../utils/http'
import Spinner from '../../Spinner'
import PhoneNumberInputLazy from '../../PhoneNumberInput/Lazy'
import Error from '../../Error'
import { trackComponent } from '../../../Tracker'

class SmsError extends Component {
  componentDidMount() {
     const errorName = this.props.error.name.toLowerCase()
     this.props.trackScreen([errorName])
   }
  render = () => <Error error={this.props.error} />
}

class CrossDeviceLink extends Component {
  constructor(props) {
    super(props)

    if (!props.socket) {
      const socket = io(process.env.DESKTOP_SYNC_URL, {autoConnect: false})
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
      this.setState({roomId: data.roomId})
    }
  }

  onGetConfig = (data) => {
    const { roomId, mobileConfig, socket,actions, nextStep } = this.props
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
      mobileNumber: null,
      error: {}
    }
  }

  linkId = `${process.env.BASE_36_VERSION}${this.props.roomId}`

  linkCopiedTimeoutId = null

  copyToClipboard = (e) => {
    e.preventDefault()
    this.textArea.select()
    document.execCommand('copy')
    e.target.focus()
    this.setState({copySuccess: true})
    this.clearLinkCopiedTimeout()
    this.linkCopiedTimeoutId = setTimeout(() => {
      this.setState({copySuccess: false})
    }, 5000)
  }

  clearLinkCopiedTimeout = () => {
    if (this.linkCopiedTimeoutId) {
      clearTimeout(this.linkCopiedTimeoutId)
    }
  }

  updateNumber = (mobileNumber) => {
    this.setState({mobileNumber})
  }

  clearPreviousAttempts = () => {
    if (this.hasInvalidNumberError()) this.clearError()
    if (this.state.mobileNumber) this.clearNumber()
  }

  clearNumber = () => {
    this.setState({mobileNumber: null})
  }

  clearError = () => {
    this.setState({error: {}})
  }

  setError = (name) => this.setState({error: {name, type: 'error'}})
  setFrontEndValidationError = (name) => this.setState({error: {name}})

  handleResponse = (response) => {
    this.setState({sending: false})
    if (response.status === "OK") {
      this.props.actions.setMobileNumber(this.state.mobileNumber)
      this.props.nextStep()
    }
    else {
      this.setError('SMS_FAILED')
    }
  }

  handleSMSError = ({status}) => {
    this.setState({sending: false})
    status === 429 ? this.setError('SMS_OVERUSE') : this.setError('SMS_FAILED')
  }

  hasInvalidNumberError = () => this.state.error.name === 'INVALID_NUMBER'

  sendSms = () => {
    this.clearError()
    if (this.state.mobileNumber) {
      this.setState({sending: true})
      const options = {
        payload: JSON.stringify({to: this.state.mobileNumber, id: this.linkId}),
        endpoint: `${process.env.SMS_DELIVERY_URL}/v1/cross_device_sms`,
        contentType: 'application/json',
        token: `Bearer ${this.props.token}`
      }
      performHttpReq(options, this.handleResponse , this.handleSMSError)
    }
    else {
      this.setFrontEndValidationError('INVALID_NUMBER')
    }
  }

  render() {
    const mobileUrl = `${process.env.MOBILE_URL}/${this.linkId}`
    const error = this.state.error
    const linkCopy = this.state.copySuccess ? 'Copied' : 'Copy'
    const buttonCopy = this.state.sending ? 'Sending' : 'Send link'
    return (
      <div>
        <div className={style.header}>
          { error.type ?
             <div className={style.requestError}><SmsError error={error} trackScreen={this.props.trackScreen}/></div>:
            <h1 className={`${theme.title} ${style.title}`}>Continue verification on your mobile</h1> }
        </div>
        <div className={theme.thickWrapper}>
          <div>We’ll text a secure link to your mobile</div>

          <div className={style.smsSection}>
            <div className={style.fieldLabel}>
              <div className={style.label}>Mobile number</div>
              <div className={style.sublabel}>(We won’t keep or share your number)</div>
            </div>

            <div className={style.numberInputSection}>
              <div className={classNames(style.inputContainer, {[style.fieldError]: this.hasInvalidNumberError()})}>
                <PhoneNumberInputLazy mobileNumber={this.props.mobileNumber} updateNumber={this.updateNumber} clearPreviousAttempts={this.clearPreviousAttempts}/>
              </div>
              <button className={classNames(theme.btn, theme["btn-primary"], style.btn, {[style.sending]: this.state.sending})}
                onClick={this.sendSms}>
                {buttonCopy}
              </button>
            </div>
          </div>
          {this.hasInvalidNumberError() && <div className={style.numberError}>Check your mobile number is correct</div>}

          <div className={style.copyLinkSection}>
            <div className={`${style.label}`}>Copy link instead:</div>
              <div className={classNames(style.actionContainer, {[style.copySuccess]: this.state.copySuccess})}>
                <textarea className={style.linkText} ref={(textarea) => this.textArea = textarea} value={mobileUrl} />
                { document.queryCommandSupported('copy') &&
                  <a href='' className={style.copyToClipboard} onClick={this.copyToClipboard}>{linkCopy}</a>
                }
              </div>
            <hr className={style.divider} />
          </div>
        </div>
      </div>
    )
  }
}

export default trackComponent(CrossDeviceLink, 'crossdevice_link')
