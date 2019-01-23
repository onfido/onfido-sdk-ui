import { h, Component} from 'preact'
import classNames from 'classnames'
import io from 'socket.io-client'

import theme from '../../Theme/style.css'
import style from './style.css'
import { performHttpReq } from '../../utils/http'
import Spinner from '../../Spinner'
import PhoneNumberInputLazy from '../../PhoneNumberInput/Lazy'
import Error from '../../Error'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import { localised } from '../../../locales'
import { parseTags } from '../../utils'

class SmsError extends Component {
  componentDidMount() {
     const errorName = this.props.error.name.toLowerCase()
     this.props.trackScreen([errorName])
   }
  render = ({error}) => <Error {...{error}} />
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
      error: {},
      validNumber: true,
    }
  }

  linkId = `${process.env.BASE_32_VERSION}${this.props.roomId}`

  linkCopiedTimeoutId = null

  copyToClipboard = (e) => {
    e.preventDefault()
    this.linkText.select()
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

  setError = (name) => this.setState({error: {name, type: 'error'}})

  clearErrors = () => {
    this.setState({error: {}})
    this.setState({validNumber: true})
  }

  handleResponse = (response) => {
    this.setState({sending: false})
    if (response.status === "OK") {
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

  sendSms = () => {
    if (this.props.sms.valid) {
      this.setState({sending: true})
      const { language } = this.props
      const options = {
        payload: JSON.stringify({to: this.props.sms.number, id: this.linkId, language}),
        endpoint: `${process.env.SMS_DELIVERY_URL}/v1/cross_device_sms`,
        contentType: 'application/json',
        token: `Bearer ${this.props.token}`
      }
      performHttpReq(options, this.handleResponse , this.handleSMSError)
    }
    else {
      this.setState({validNumber: false})
    }
  }

  mobileUrl = () =>
    // This lets us test the cross device flow locally and on surge.
    // We use the same location to test the same bundle as the desktop flow.
    process.env.MOBILE_URL === "/" ?
      `${window.location.origin}${window.location.pathname}?link_id=${this.linkId}` :
      `${process.env.MOBILE_URL}/${this.linkId}`

  render() {
    const { translate } = this.props
    const mobileUrl = this.mobileUrl()
    const error = this.state.error
    const linkCopy = this.state.copySuccess ? translate('cross_device.link.link_copy.success') : translate('cross_device.link.link_copy.action')
    const buttonCopy = this.state.sending ? translate('cross_device.link.button_copy.status')  : translate('cross_device.link.button_copy.action')
    const invalidNumber = !this.state.validNumber
    return (
      <div>
        { error.type ?
          <SmsError error={error} trackScreen={this.props.trackScreen}/> :
          <Title title={translate('cross_device.link.title')} /> }
        <div className={theme.thickWrapper}>
          <div className={style.subTitle}>
          {
            parseTags(translate('cross_device.link.sub_title'), ({text}) =>
              <span className={style.bolder}>{text}</span>
            )
          }
          </div>
          <div className={style.smsSection}>
            <div className={style.label}>{translate('cross_device.link.sms_label')}</div>
            <div className={style.numberInputSection}>
              <div className={classNames(style.inputContainer, {[style.fieldError]: invalidNumber})}>
                <PhoneNumberInputLazy { ...this.props} clearErrors={this.clearErrors} />
              </div>
              <button className={classNames(theme.btn, theme["btn-primary"], style.btn, {[style.sending]: this.state.sending})}
                onClick={this.sendSms}>
                {buttonCopy}
              </button>
            </div>
          </div>
          { invalidNumber && <div className={style.numberError}>{translate('errors.invalid_number.message')}</div> }
          <div className={style.copyLinkSection}>
            <div className={`${style.label}`}>{translate('cross_device.link.copy_link_label')}</div>
              <div className={classNames(style.linkContainer, {[style.copySuccess]: this.state.copySuccess})}>
                <textarea className={style.linkText} value={mobileUrl} ref={(element) => this.linkText = element}/>
                { document.queryCommandSupported('copy') &&
                  <div className={style.actionContainer}>
                    <a href='' className={style.copyToClipboard} onClick={this.copyToClipboard}>{linkCopy}</a>
                  </div>
                }
              </div>
            <hr className={style.divider} />
          </div>
        </div>
      </div>
    )
  }
}

export default trackComponent(localised(CrossDeviceLink), 'crossdevice_link')
