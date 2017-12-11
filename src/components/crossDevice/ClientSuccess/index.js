import { h, Component } from 'preact'

import Title from '../../Title'
import theme from '../../Theme/style.css'
import style from './style.css'
import { trackComponent } from '../../../Tracker'

class ClientSuccess extends Component {
  componentDidMount () {
    this.props.sendClientSuccess()
  }

  render () {
    const i18n = this.props.i18n
    return (
      <div>
        <Title title={i18n.t('cross_device.client_success.title')} subTitle={i18n.t('cross_device.client_success.sub_title')} />
        <div class={theme.thickWrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
          <div className={style.text}>Your computer may take a few seconds to update</div>
        </div>
      </div>
    )
  }
}

export default trackComponent(ClientSuccess, 'crossdevice_mobile_success')
