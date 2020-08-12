import { h, Component } from 'preact'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { localised } from '../../../locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'

class ClientSuccess extends Component {
  componentDidMount() {
    this.props.sendClientSuccess()
  }

  render() {
    const { translate } = this.props
    return (
      <div>
        <PageTitle
          title={translate('cross_device.client_success.title')}
          subTitle={translate('cross_device.client_success.sub_title')}
        />
        <div class={theme.thickWrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
          <div className={style.text}>
            {translate('cross_device.client_success.body')}
          </div>
        </div>
      </div>
    )
  }
}

export default trackComponent(
  localised(ClientSuccess),
  'crossdevice_mobile_success'
)
