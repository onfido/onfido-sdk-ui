import { h, Component } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import { trackComponent } from '../../../Tracker'

class ClientSuccess extends Component {
  componentDidMount () {
    this.props.nextStep()
  }

  render () {
    return (
      <div className={style.base}>
        <h1 className={`${theme.title} ${theme.center} ${style.title}`}>Uploads successful</h1>
        <p className={`${theme.center} ${style.submessage}`}>You can now return to your computer to continue</p>
        <span className={`${theme.icon}  ${style.icon}`} />
        <div className={style.text}>Your computer may take a few seconds to update</div>
      </div>
    )
  }
}

export default trackComponent(ClientSuccess, 'mobile_success')
