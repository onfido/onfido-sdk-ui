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
    return (
      <div className={style.qrCodeHelp}>
        <button
          className={classNames(theme.link, style.qrCodeHelpButton)}
          onClick={this.toggleHelpListVisibility}>
          {translate('cross_device.link.qr_code.help_label')}
        </button>
        {this.state.isExpanded &&
          <ul className={style.qrCodeHelpList}>
            <li>{translate('cross_device.link.qr_code.help_li_1')}</li>
            <li>{translate('cross_device.link.qr_code.help_li_2')}</li>
          </ul>}
      </div>
    )
  }

}

export default localised(QRCodeHowTo)
