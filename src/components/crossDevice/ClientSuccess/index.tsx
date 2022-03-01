import { h, Component } from 'preact'
import classNames from 'classnames'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import theme from '../../Theme/style.scss'
import style from './style.scss'
import { useLocales } from '~locales'
import type { StepComponentProps } from '~types/routers'

export type Props = {
  sendClientSuccess: () => void
} & StepComponentProps

class ClientSuccess extends Component<Props> {
  componentDidMount() {
    this.props.sendClientSuccess()
  }

  render() {
    const { translate } = useLocales();
    return (
      <div data-page-id={'CrossDeviceClientSuccess'}>
        <PageTitle
          title={translate('cross_device_return.title')}
          subTitle={translate('cross_device_return.subtitle')}
        />
        <div className={theme.iconContainer}>
          <span className={classNames(theme.icon, style.icon)} />
          <div className={style.text}>
            {translate('cross_device_return.body')}
          </div>
        </div>
      </div>
    )
  }
}

export default trackComponent(
  ClientSuccess,
  'crossdevice_mobile_success'
)
