import { h, Component } from 'preact'
import theme from '../Theme/style.css'
import style from './style.css'

class VerificationComplete extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    if (!this.props.crossDevice){
      this.props.nextStep()
    }
  }

  render ({message, submessage}) {
    return (
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

VerificationComplete.defaultProps =  {
  message: 'Verification complete',
  submessage: 'Thank you.'
}

export default VerificationComplete
