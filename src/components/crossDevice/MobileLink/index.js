import { h, Component} from 'preact'
import theme from '../../Theme/style.css'
import style from './style.css'
import {preventDefaultOnClick} from '../../utils'

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
    const buttonCopy = this.state.copySuccess ? 'Copied!' : 'Copy'
    return (
      <div>
        <div className={style.container}>
          <h1 className={theme.title}>Continue verification on your mobile</h1>
          <div>Copy and send the below link to your mobile</div>
          <div>Secure link:</div>
          <div>
            <form>
              <textarea
                ref={(textarea) => this.textArea = textarea}
                value={mobileUrl}
              />
              { document.queryCommandSupported('copy') &&
                <div>
                  <button onClick={preventDefaultOnClick(this.copyToClipboard)}>{buttonCopy}</button>
                </div>
              }
            </form>
          </div>
          <div>This link will expire in one hour</div>
          <div className={style.instructions}>
            <div className={style.header}>How do I do this?</div>
            <div><b>OPTION 1:</b> Copy link – Email to your mobile – Open</div>
            <div><b>OPTION 2:</b> Type link into your mobile web browser</div>
          </div>
        </div>
      </div>
    );
  }
}

export default MobileLink
