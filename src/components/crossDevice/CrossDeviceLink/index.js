import { h, Component} from 'preact'
import classNames from 'classnames'
import io from 'socket.io-client'

import theme from '../../Theme/style.css'
import style from './style.css'
import Spinner from '../../Spinner'
import { trackComponent } from '../../../Tracker'

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
    const { roomId, mobileConfig, socket, nextStep } = this.props
    if (roomId && roomId !== data.roomId) {
      socket.emit('leave', {roomId})
    }
    this.sendMessage('config', data.roomId, mobileConfig)
    nextStep()
  }

  onClientSuccess = () => {
    this.props.actions.setClientSuccess(true)
    this.props.nextStep()
  }

  sendMessage = (event, roomId, payload) => {
    this.props.socket.emit('message', {event, payload, roomId})
  }

  render = () =>
    this.props.roomId ? <CrossDeviceLinkUI roomId={this.props.roomId} /> : <Spinner />
}

class CrossDeviceLinkUI extends Component {
  constructor(props) {
    super(props)
    this.state = {copySuccess: false}
  }

  copyToClipboard = (e) => {
    this.textArea.select()
    document.execCommand('copy')
    e.target.focus()
    this.setState({copySuccess: true})
  }

  render({roomId}) {
    const mobilePath = `${process.env.BASE_36_VERSION}${roomId}`
    const mobileUrl = `${process.env.MOBILE_URL}/${mobilePath}`
    const buttonCopy = this.state.copySuccess ? 'Copied' : 'Copy link'
    return (
      <div className={theme.step}>
        <h1 className={`${theme.title} ${style.title}`}>Continue verification on your mobile</h1>
        <div>Copy and send the below link to your mobile</div>

        <div className={style.linkSection}>
          <div className={style.linkTitle}>Secure link</div>
          <div className={classNames(style.actionContainer, {[style.copySuccess]: this.state.copySuccess})}>
            <textarea ref={(textarea) => this.textArea = textarea} value={mobileUrl} />
            { document.queryCommandSupported('copy') &&
              <button className={`${theme.btn} ${theme["btn-primary"]} ${style.btn}`}
                onClick={this.copyToClipboard}>
                {buttonCopy}
              </button>
            }
          </div>
          <div className={style.infoText}>This link will expire in one hour</div>
        </div>
        <div className={theme.header}>How do I do this?</div>
        <div className={theme.help}>
          <ul className={`${style.helpList} ${theme.helpList}`}>
            <li><b>OPTION 1:</b> Copy link – Email to your mobile – Open</li>
            <li><b>OPTION 2:</b> Type link into your mobile web browser</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default trackComponent(CrossDeviceLink, 'crossdevice_link')
