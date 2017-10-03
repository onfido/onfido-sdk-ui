import { h, Component} from 'preact'
import classNames from 'classnames'
import io from 'socket.io-client'

import theme from '../../Theme/style.css'
import style from './style.css'
import { trackComponent } from '../../../Tracker'
import { versionToBase36 } from '../../utils/versionMap'

class CrossDeviceLink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      copySuccess: false,
      roomId: null
    }

    if (!props.socket) {
      const socket = io(process.env.DESKTOP_SYNC_URL)
      props.actions.setSocket(socket)
      this.listen(socket)
    }
  }

  componentDidMount() {
    if (this.props.socket) {
      this.listen(this.props.socket)
    }
  }

  componentWillUnmount() {
    this.props.socket.off('joined')
    this.props.socket.off('left')
    this.props.socket.off('get config')
    this.props.socket.off('complete')
  }

  listen = (socket) => {
    socket.on('joined', this.onJoined)
    socket.on('get config', this.onGetConfig)
    socket.on('complete', this.onMobileComplete)
    socket.emit('join', {})
  }

  onJoined = (data) => {
    this.setState({roomId: data.roomId})
  }

  onGetConfig = (data) => {
    if (this.props.roomId) {
      this.props.socket.emit('leave', {roomId: this.props.roomId})
    }
    this.props.actions.setRoomId(data.roomId)
    this.sendMessage('config', this.props.mobileConfig, data.roomId)
    this.props.nextStep()
  }

  onMobileComplete = () => {
    this.props.actions.setMobileComplete(true)
    this.props.nextStep()
  }

  sendMessage = (event, payload, roomId) => {
    this.props.socket.emit('message', {event, payload, roomId})
  }

  copyToClipboard = (e) => {
    this.textArea.select()
    document.execCommand('copy')
    e.target.focus()
    this.setState({ copySuccess: true})
  }

  render() {
    const version = process.env.SDK_VERSION
    const minorVersion = version.substr(0, version.lastIndexOf('.'))
    const mobilePath = `${versionToBase36[minorVersion]}${this.state.roomId}`
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
    );
  }
}

export default trackComponent(CrossDeviceLink, 'crossdevice_link')
