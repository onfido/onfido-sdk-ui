import { h, Component } from 'preact'

import { trackComponent } from '../../Tracker'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'
import { withTreeContext } from '../Tree'

class Complete extends Component {
  componentDidMount () {
    this.props.next()
  }

  render ({message, submessage, i18n}) {
    const completeMessage = message || i18n.t('complete.message')
    const completeSubmessage = submessage || i18n.t('complete.submessage')
    return (
      <div className={style.wrapper}>
          <span className={`${theme.icon}  ${style.icon}`}></span>
          <Title title={completeMessage} subTitle={completeSubmessage} />
      </div>
    )
  }
}

export default withTreeContext(trackComponent(Complete))
