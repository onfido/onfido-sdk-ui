import { h, FunctionComponent } from 'preact'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { preventDefaultOnClick } from '~utils'
import { useLocales } from '~locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'

import type { WithTrackingProps } from '~types/hocs'

type MobileConnectedProps = {
  back: () => void
}

type Props = MobileConnectedProps & WithTrackingProps

const MobileConnected: FunctionComponent<Props> = ({ back }) => {
  const { translate } = useLocales()

  return (
    <div data-page-id={'CrossDeviceMobileConnected'}>
      <PageTitle
        title={translate('switch_phone.title')}
        subTitle={translate('switch_phone.subtitle')}
      />
      <div>
        <span className={`${theme.icon} ${style.icon}`} />
        <div className={theme.header} role="heading" aria-level="3">
          {translate('switch_phone.info')}
        </div>
        <div className={`${style.help} ${theme.help}`}>
          <ul
            className={theme.helpList}
            aria-label={translate('switch_phone.info')}
          >
            <li>{translate('switch_phone.info_link_window')}</li>
            <li>{translate('switch_phone.info_link_expire')}</li>
            <li>{translate('switch_phone.info_link_refresh')}</li>
          </ul>
        </div>
        <a
          href="#"
          role="button"
          className={`${theme.link} ${style.cancel}`}
          onClick={preventDefaultOnClick(back)}
        >
          {translate('switch_phone.link')}
        </a>
      </div>
    </div>
  )
}

export default trackComponent(MobileConnected, 'mobile_connected')
