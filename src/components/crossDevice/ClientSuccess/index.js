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
    return (
      <div>
        <Title title='Uploads successful' subTitle='You can now return to your computer to continue' />
        <div class={theme.thickWrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
          <div className={style.text}>Your computer may take a few seconds to update</div>
        </div>
      </div>
    )
  }
}

export default trackComponent(ClientSuccess, 'crossdevice_mobile_success')
