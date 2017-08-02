import { h, Component } from 'preact'
import { events } from '../../core'
import theme from '../Theme/style.css'
import style from './style.css'
import { trackComponent } from '../../Tracker'

class Complete extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.nextStep()
  }

  render ({message, submessage}) {
    return (
      <div>
      <div className={theme.step}>
        <span className={`${theme.icon}  ${style.icon}`}></span>
        <h1 className={`${theme.title} ${theme.center}`}>{message}</h1>
        <p className={`${theme["mbottom-large"]} ${theme.center}`}>{submessage}</p>
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
