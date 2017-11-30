import { h, Component } from 'preact'

import { trackComponent } from '../../Tracker'
import Title from '../Title'
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
          <Title title={message} subTitle={submessage} />
      </div>
    )
  }
}

Complete.defaultProps =  {
  message: 'Verification complete',
  submessage: 'Thank you.'
}

export default trackComponent(Complete)
