import { h, Component } from 'preact'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
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
      <ScreenLayout>
        <div className={style.wrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
          <PageTitle title={title} subTitle={body} />
        </div>
      </ScreenLayout>
    )
  }
}

export default trackComponent(localised(Complete))
