import { h, Component } from 'preact'

import { trackComponent } from '../../Tracker'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'
import { localised } from '../../locales'

class Complete extends Component {
  componentDidMount () {
    this.props.nextStep()
  }

  render ({message, submessage, t}) {
    const completeMessage = message || t('complete.message')
    const completeSubmessage = submessage || t('complete.submessage')
    return (
      <div className={style.wrapper}>
          <span className={`${theme.icon}  ${style.icon}`}></span>
          <Title title={completeMessage} subTitle={completeSubmessage} />
      </div>
    )
  }
}

export default trackComponent(localised(Complete))
