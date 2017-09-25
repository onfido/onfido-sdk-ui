import { h, Component} from 'preact'
import theme from '../../Theme/style.css'
import style from './style.css'
import classNames from 'classnames'

class MobileLink extends Component {
  constructor(props) {
    super(props);
    this.state = { copySuccess: false }
  }

  copyToClipboard = (e) => {
    this.textArea.select()
    document.execCommand('copy')
    e.target.focus();
    this.setState({ copySuccess: true})
  };

  render() {
    const mobileUrl = this.props.mobileUrl
    const buttonCopy = this.state.copySuccess ? 'Copied' : 'Copy link'
    return (
      <div>
        <div className={style.container}>
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

          <div className={style.help}>
            <div className={style.header}>How do I do this?</div>
            <div className={style.helpContainer}>
              <p><b>OPTION 1:</b> Copy link – Email to your mobile – Open</p>
              <p><b>OPTION 2:</b> Type link into your mobile web browser</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MobileLink
