import { h } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'

const MobileNotificationSent = ({sms, i18n, previousStep}) =>
  <div>
    <Title title='Check your mobile' />
    <div className={theme.thickWrapper}>
      <div className={style.submessage}>{i18n.t('cross_device.mobile_notification_sent.submessage', {number: sms.number})}</div>
      <div className={style.boldMessage}>{i18n.t('cross_device.mobile_notification_sent.bold_message')}</div>
      <span className={`${theme.icon} ${style.icon}`}></span>
      <div className={theme.header}>{i18n.t('cross_device.tips')}</div>
      <div className={`${style.help} ${theme.help}`}>
        <ul className={`${style.helpList} ${theme.helpList}`}>
          <li>{i18n.t('cross_device.mobile_notification_sent.tips.item_1')}</li>
          <li>{i18n.t('cross_device.mobile_notification_sent.tips.item_2')}</li>
        </ul>
      </div>
      <div href='#' className={style.cancel}
         onClick={preventDefaultOnClick(previousStep)}>
         {i18n.t('cross_device.mobile_notification_sent.resend_link')}
      </div>
    </div>
  </div>

export default trackComponent(MobileNotificationSent, 'mobile_notification_sent')
