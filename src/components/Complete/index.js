import { h, Component } from 'preact'
import { trackComponent } from '../../Tracker'
import PageTitle from '../PageTitle'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'

class Complete extends Component {
  componentDidMount() {
    this.props.nextStep()
  }

  render({ message, submessage, translate }) {
    const completeMessage = message || translate('complete.message')
    const completeSubmessage = submessage || translate('complete.submessage')
    return (
      <div className={style.wrapper}>
        <span className={`${theme.icon}  ${style.icon}`}></span>
        <PageTitle title={completeMessage} subTitle={completeSubmessage} />
      </div>
    )
  }
}

export default trackComponent(localised(Complete))
