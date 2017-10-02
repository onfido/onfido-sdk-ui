import { h, Component } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'
import { trackComponent } from '../../Tracker'
import MobileComplete from '../MobileComplete'

class Complete extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.nextStep()
  }

  render ({message, submessage}) {
    return (
      this.props.mobileFlow ?
      <MobileComplete /> :
      <div>
        <div className={theme.step}>
          <span className={`${theme.icon}  ${style.icon}`}></span>
          <h1 className={`${theme.title} ${theme.center}`}>{message}</h1>
          <p className={`${theme["mbottom-large"]} ${theme.center} ${style.submessage}`}>{submessage}</p>
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
