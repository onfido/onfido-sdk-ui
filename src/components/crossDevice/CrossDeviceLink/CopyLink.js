import { h, Component } from 'preact'
import classNames from 'classnames'
import { copyToClipboard } from '~utils'
import { localised } from '../../../locales'
import style from './style.scss'

class CopyLink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      copySuccess: false,
    }
  }

  onCopySuccess = () => {
    this.setState({ copySuccess: true })
    this.clearLinkCopiedTimeout()
    this.linkCopiedTimeoutId = setTimeout(() => {
      this.setState({ copySuccess: false })

      // move focus away from Copy button to prevent screen readers announcing
      // text changing back from "Copied" to "Copy"
      if (this.linkText) {
        this.linkText.focus()
      }
    }, 5000)
  }

  clearLinkCopiedTimeout = () => {
    if (this.linkCopiedTimeoutId) {
      clearTimeout(this.linkCopiedTimeoutId)
    }
  }

  render() {
    const { translate, mobileUrl } = this.props
    const { copySuccess } = this.state
    const linkCopyKey = copySuccess
      ? 'get_link.button_copied'
      : 'get_link.button_copy'
    return (
      <div className={style.copyLinkSection}>
        <div className={style.label}>
          {translate('get_link.url_field_label')}
        </div>
        <div
          className={classNames(
            style.linkContainer,
            copySuccess && style.copySuccess
          )}
        >
          <span
            className={style.linkText}
            ref={(element) => (this.linkText = element)}
          >
            {mobileUrl}
          </span>
          {document.queryCommandSupported('copy') && (
            <div
              className={style.actionContainer}
              aria-live="polite"
              aria-relevant="text"
            >
              <button
                type="button"
                onClick={() => copyToClipboard(mobileUrl, this.onCopySuccess)}
                className={style.copyToClipboard}
              >
                {translate(linkCopyKey)}
              </button>
            </div>
          )}
        </div>
        <hr className={style.divider} />
      </div>
    )
  }
}

export default localised(CopyLink)
