import { h } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'
import { localised } from '../../../locales'

const MobileNotificationSent = ({sms, t, previousStep}) =>
  <div>
    <Title title={t('cross_device.mobile_notification_sent.title')}/>
    <div className={theme.thickWrapper}>
      <div className={style.submessage}>{t('cross_device.mobile_notification_sent.submessage', {number: sms.number})}</div>
      <div className={style.boldMessage}>{t('cross_device.mobile_notification_sent.bold_message')}</div>
      <span className={`${theme.icon} ${style.icon}`}></span>
      <div className={theme.header}>{t('cross_device.tips')}</div>
      <div className={`${style.help} ${theme.help}`}>
        <ul className={`${style.helpList} ${theme.helpList}`}>
          <li>{t('cross_device.mobile_notification_sent.tips.item_1')}</li>
          <li>{t('cross_device.mobile_notification_sent.tips.item_2')}</li>
        </ul>
      </div>
      <a href='#' className={style.cancel}
         onClick={preventDefaultOnClick(previousStep)}>
         {t('cross_device.mobile_notification_sent.resend_link')}
      </a>
    </div>
  </div>

export default trackComponent(localised(MobileNotificationSent), 'mobile_notification_sent')
