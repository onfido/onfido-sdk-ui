import { h } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { preventDefaultOnClick } from '~utils/index'
import { localised } from '../../../locales'

const MobileNotificationSent = ({ sms, translate, previousStep }) => (
  <div>
    <PageTitle title={translate('cross_device.mobile_notification_sent.title')} />
    <div className={theme.thickWrapper}>
      <div className={style.submessage}>
        {translate('cross_device.mobile_notification_sent.submessage', { number: sms.number })}
      </div>
      <div className={style.boldMessage}>
        {translate('cross_device.mobile_notification_sent.bold_message')}
      </div>
      <span className={`${theme.icon} ${style.icon}`}></span>
      <div className={theme.header}>
        {translate('cross_device.tips')}
      </div>
      <div className={`${style.help} ${theme.help}`}>
        <ul className={theme.helpList} aria-label={translate('cross_device.tips')}>
          <li>{translate('cross_device.mobile_notification_sent.tips.item_1')}</li>
          <li>{translate('cross_device.mobile_notification_sent.tips.item_2')}</li>
        </ul>
      </div>
      <a href="#" className={`${theme.link} ${style.cancel}`} onClick={preventDefaultOnClick(previousStep)}>
        {translate('cross_device.mobile_notification_sent.resend_link')}
      </a>
    </div>
  </div>
)

export default trackComponent(localised(MobileNotificationSent), 'mobile_notification_sent')
