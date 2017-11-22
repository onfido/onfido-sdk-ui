import { h, Component } from 'preact'

import { trackComponent } from '../../Tracker'
import theme from '../Theme/style.css'
import style from './style.css'

class Complete extends Component {
  componentDidMount () {
    this.props.nextStep()
  }

  render ({message, submessage}) {
    return (
      <div className={style.wrapper}>
          <span className={`${theme.icon}  ${style.icon}`}></span>
          <h1 className={theme.title}>{message}</h1>
        <div className={theme.thickWrapper}>
          <p className={`${theme.center} ${style.submessage}`}>{submessage}</p>
        </div>
      </div>
    )
  }
}

Complete.defaultProps =  {
  message: 'Verification complete',
  submessage: 'Thank you.'
}

export default trackComponent(Complete)
