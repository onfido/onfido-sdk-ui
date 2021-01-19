import { h } from 'preact'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { preventDefaultOnClick } from '~utils'
import { localised } from '../../../locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'

const MobileConnected = ({ translate, back }) => (
  <div>
    <PageTitle
      title={translate('switch_phone.title')}
      subTitle={translate('switch_phone.subtitle')}
    />
    <div className={theme.thickWrapper}>
      <span className={`${theme.icon} ${style.icon}`} />
      <div className={theme.header}>{translate('switch_phone.info')}</div>
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
        className={`${theme.link} ${style.cancel}`}
        onClick={preventDefaultOnClick(back)}
      >
        {translate('switch_phone.link')}
      </a>
    </div>
  </div>
)

export default trackComponent(localised(MobileConnected), 'mobile_connected')
