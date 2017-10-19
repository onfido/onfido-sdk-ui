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
    const roomId = this.props.roomId || null
    this.state = {roomId}

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
    socket.emit('join', {roomId: this.state.roomId})
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
    this.state.roomId ? <CrossDeviceLinkUI roomId={this.state.roomId} /> : <Spinner />
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
