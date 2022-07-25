import { h, Component } from 'preact'
import classNames from 'classnames'
import { localised } from '~locales'
import theme from '../Theme/style.scss'
import style from './style.scss'
import { WithLocalisedProps } from '~types/hocs'
import { trackException } from 'Tracker'

type Props = WithLocalisedProps
type State = {
  isExpanded: boolean
}

class QRCodeHowTo extends Component<Props, State> {
  constructor() {
    super()
    this.state = {
      isExpanded: false,
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
          className={classNames(theme.textButton, style.qrCodeHelpButton)}
          onClick={this.toggleHelpListVisibility}
        >
          {translate('get_link.info_qr_how')}
        </button>
        <ul hidden={!isExpanded} className={style.qrCodeHelpList}>
          <li data-onfido-qa="qrCodeHowToStep1">
            {translate('get_link.info_qr_how_list_item_camera')}
          </li>
          <li data-onfido-qa="qrCodeHowToStep2">
            {translate('get_link.info_qr_how_list_item_download')}
          </li>
        </ul>
      </div>
    )
  }
}

export default localised(QRCodeHowTo)
