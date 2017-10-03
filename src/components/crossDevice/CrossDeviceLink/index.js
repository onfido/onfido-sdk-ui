import { h, Component} from 'preact'
import classNames from 'classnames'

import theme from '../../Theme/style.css'
import style from './style.css'
import { trackComponent } from '../../../Tracker'
import { versionToBase36 } from '../../utils/versionMap'

class CrossDeviceLink extends Component {
  constructor(props) {
    super(props)
    this.state = {copySuccess: false}
    this.props.socket.on('get config', this.onGetConfig)
  }

  componentWillUnmount() {
    this.props.socket.off('get config')
  }

  onGetConfig = () => {
    this.props.sendConfig()
    this.props.nextStep()
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
    const mobilePath = `${versionToBase36[minorVersion]}${this.props.roomId}`
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
