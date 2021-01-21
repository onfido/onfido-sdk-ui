import { h } from 'preact'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { preventDefaultOnClick } from '~utils'
import { localised } from '../../../locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'

const MobileNotificationSent = ({ sms, translate, previousStep }) => (
  <div>
    <PageTitle title={translate('sms_sent.title')} />
    <div className={theme.thickWrapper}>
      <div className={style.submessage}>
        {translate('sms_sent.subtitle', {
          number: sms.number,
        })}
      </div>
      <div className={style.boldMessage}>
        {translate('sms_sent.subtitle_minutes')}
      </div>
      <span className={`${theme.icon} ${style.icon}`} />
      <div className={theme.header}>{translate('sms_sent.info')}</div>
      <div className={`${style.help} ${theme.help}`}>
        <ul className={theme.helpList} aria-label={translate('sms_sent.info')}>
          <li>{translate('sms_sent.info_link_window')}</li>
          <li>{translate('sms_sent.info_link_expire')}</li>
        </ul>
      </div>
      <a
        href="#"
        className={`${theme.link} ${style.cancel}`}
        onClick={preventDefaultOnClick(previousStep)}
      >
        {translate('sms_sent.link')}
      </a>
    </div>
  </div>
)

export default trackComponent(
  localised(MobileNotificationSent),
  'mobile_notification_sent'
)
