import { h, Component } from 'preact'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import { localised } from '../../locales'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { StepComponentBaseProps } from '~types/routers'
import theme from '../Theme/style.scss'
import style from './style.scss'

type Props = {
  nextStep?: () => void
} & WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

class Reject extends Component<Props> {
  componentDidMount() {
    this.props.nextStep()
  }

  render() {
    const { translate } = this.props
    const title = translate('workflow_complete.reject.title')
    const body = translate('workflow_complete.reject.description')

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
