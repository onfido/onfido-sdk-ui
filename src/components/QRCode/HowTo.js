import { h, Component } from 'preact'
import classNames from 'classnames'

import { localised } from '../../locales'
import theme from '../Theme/style.css'
import style from './style.css'

class QRCodeHowTo extends Component {

  constructor() {
    super()
    this.state = {
      isExpanded: false
    }
  }

  toggleHelpListVisibility = () => {
    this.setState({ isExpanded: !this.state.isExpanded })
  }

  render() {
    const { translate } = this.props
    const { isExpanded } = this.state
    return (
      <div className={style.qrCodeHelp}>
        <i className={style.qrCodeHelpIcon} />
        <button
          type="button"
          aria-atomic="false"
          aria-expanded={isExpanded}
          className={classNames(theme.link, style.qrCodeHelpButton)}
          onClick={this.toggleHelpListVisibility}>
          {translate('cross_device.link.qr_code.help_label')}
        </button>
        <ul hidden={!isExpanded} className={style.qrCodeHelpList}>
          <li data-onfido-qa="qrCodeHowToStep1">{translate('cross_device.link.qr_code.help_step_1')}</li>
          <li data-onfido-qa="qrCodeHowToStep2">{translate('cross_device.link.qr_code.help_step_2')}</li>
        </ul>
      </div>
    )
  }

}

export default localised(QRCodeHowTo)
