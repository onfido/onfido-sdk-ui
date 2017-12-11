import { h, Component } from 'preact'

import { trackComponent } from '../../Tracker'
import Title from '../Title'
import theme from '../Theme/style.css'
import style from './style.css'

class Complete extends Component {
  componentDidMount () {
    this.props.nextStep()
  }

  render ({i18n}) {
    return (
      <div className={style.wrapper}>
          <span className={`${theme.icon}  ${style.icon}`}></span>
          <Title title={i18n.t('complete.message')} subTitle={i18n.t('complete.submessage')} />
      </div>
    )
  }
}

export default trackComponent(Complete)
