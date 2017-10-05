import { h, Component } from 'preact'

import { trackComponent } from '../../../Tracker'
import theme from '../../Theme/style.css'
import style from './style.css'

class MobileSuccess extends Component {
  constructor (props) {
    super(props)
  }

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

export default trackComponent(MobileSuccess, 'crossdevice_mobile_success')
