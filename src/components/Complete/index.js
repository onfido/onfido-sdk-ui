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
    const title = message || translate('outro.title')
    const body = submessage || translate('outro.body')

    return (
      <div className={style.wrapper}>
        <span className={`${theme.icon}  ${style.icon}`} />
        <PageTitle title={title} subTitle={body} />
      </div>
    )
  }
}

export default trackComponent(localised(Complete))
