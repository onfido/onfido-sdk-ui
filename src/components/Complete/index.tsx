import { h, Component } from 'preact'
import { trackComponent } from '../../Tracker'
import ScreenLayout from '../Theme/ScreenLayout'
import PageTitle from '../PageTitle'
import { localised } from '~locales'
import theme from '../Theme/style.scss'
import style from './style.scss'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { StepComponentBaseProps } from '~types/routers'

type Props = {
  message?: string
  submessage?: string
} & WithLocalisedProps &
  WithTrackingProps &
  StepComponentBaseProps

class Complete extends Component<Props> {
  componentDidMount() {
    this.props.nextStep()
  }

  render() {
    const { translate } = this.props

    const title = this.props.message || translate('outro.title')
    const body = this.props.submessage || translate('outro.body')

    return (
      <ScreenLayout pageId={'Complete'}>
        <div className={style.wrapper}>
          <span className={`${theme.icon}  ${style.icon}`} />
          <PageTitle title={title} subTitle={body} />
        </div>
      </ScreenLayout>
    )
  }
}

export default trackComponent(localised(Complete))
