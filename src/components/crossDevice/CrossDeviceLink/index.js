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

class CrossDeviceLink extends Component {
  constructor(props) {
    super(props)
    this.state = {mobileNumber: null}

    if (!props.socket) {
      const socket = io(process.env.DESKTOP_SYNC_URL)
      props.actions.setSocket(socket)
    }
  }

  componentDidMount() {
    if (this.props.socket) {
      this.listen(this.props.socket)
    }
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
    socket.off('joined', this.onJoined)
    socket.off('get config', this.onGetConfig)
    socket.off('clientSuccess', this.onClientSuccess)
  }

  listen = (socket) => {
    if (!socket) return
    socket.on('joined', this.onJoined)
    socket.on('get config', this.onGetConfig)
    socket.on('clientSuccess', this.onClientSuccess)
    const roomId = this.props.roomId || null
    socket.emit('join', {roomId})
  }

  onJoined = (data) => {
    const {actions, roomId} = this.props
    if (!roomId) {
      actions.setRoomId(data.roomId)
      this.setState({roomId: data.roomId})
    }
  }

  onGetConfig = (data) => {
    const { roomId, mobileConfig, socket, nextStep } = this.props
    if (roomId && roomId !== data.roomId) {
      socket.emit('leave', {roomId})
    }
    this.sendMessage('config', mobileConfig, data.roomId)
    nextStep()
  }

  onClientSuccess = () => {
    this.props.actions.setClientSuccess(true)
    this.props.nextStep()
  }

  sendMessage = (event, payload, roomId) => {
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
    if (this.hasNumberError()) this.clearError()
    if (this.state.mobileNumber) this.clearNumber()
  }

  clearNumber = () => {
    this.setState({mobileNumber: null})
  }
  clearError = () => {
    this.setState({error: {}})
  }

  setError = (name, type) => this.setState({error: {name, type}})

  handleResponse = (response) => {
    if (response.status === "OK") {
      this.props.actions.setMobileNumber(this.state.mobileNumber)
      this.props.nextStep()
    }
    else {
      this.setError('SMS_FAILED', 'error')
    }
  }

  handleSMSError = ({status}) => {
    status === 429 ? this.setError('SMS_OVERUSE', 'error') : this.setError('SMS_FAILED', 'error')
  }

  hasNumberError = () => this.state.error.name === 'numberError'

  sendSms = () => {
    this.setState({sending: true})
    if (this.state.mobileNumber) {
      const options = {
        payload: JSON.stringify({to: this.state.mobileNumber, id: this.props.roomId}),
        endpoint: `${process.env.SMS_DELIVERY_URL}/v1/cross_device_sms`,
        contentType: 'application/json',
        token: `Bearer ${this.props.token}`
      }
      performHttpReq(options, this.handleResponse , this.handleSMSError)
    }
    else {
      this.setError('numberError')
    }
  }

  render({roomId}) {
    const mobilePath = `${process.env.BASE_36_VERSION}${roomId}`
    const mobileUrl = `${process.env.MOBILE_URL}/${mobilePath}`
    const error = this.state.error
    const linkCopy = this.state.copySuccess ? 'Copied' : 'Copy'
    return (
      <div className={theme.step}>
        { error.type ? <Error error={error}/> : <h1 className={`${theme.title} ${style.title}`}>Continue verification on your mobile</h1> }
        <div>We’ll text a secure link to your mobile</div>

        <div className={style.smsSection}>
          <div className={style.fieldLabel}>
            <div className={style.label}>Mobile number</div>
            <div className={style.sublabel}>(We won’t keep or share your number)</div>
          </div>

          <div className={style.numberInput}>
            <PhoneNumberInputLazy updateNumber={this.updateNumber} clearPreviousAttempts={this.clearPreviousAttempts}/>
            <button className={`${theme.btn} ${theme["btn-primary"]} ${style.btn}`}
              onClick={this.sendSms}>
              Send link
            </button>
          </div>
        </div>
        {this.hasNumberError() && <div className={style.numberError}>Check your mobile number is correct</div>}

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
    )
  }
}

export default trackComponent(CrossDeviceLink, 'crossdevice_link')
