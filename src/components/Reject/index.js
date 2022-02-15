import { h, Component } from 'preact'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import { localised } from '../../locales'
import theme from '../Theme/style.scss'
import style from './style.scss'

class Reject extends Component {
  componentDidMount() {
    this.props.nextStep()
  }

<<<<<<< HEAD
  render() {
    const title = 'Rejected'
    const body = "We haven't been able to verify your identity"
=======
  render({ translate }) {
    const title = translate('workflow_complete.reject.title')
    const body = translate('workflow_complete.reject.description')
>>>>>>> b2a217a8 (filter historykey reverted and review feedback clean up)

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

export default trackComponent(localised(Reject))
