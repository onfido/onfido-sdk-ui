import { h } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import Title from '../../Title'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'

const MobileNotificationSent = (props) =>
  <div>
    <Title title='Check your mobile' />
    <div className={theme.thickWrapper}>
      <div className={style.submessage}>We’ve sent a secure link to {props.sms.number}</div>
      <div className={style.boldMessage}>It may take a few minutes to arrive</div>
      <span className={`${theme.icon} ${style.icon}`}></span>
      <div className={theme.header}>Tips</div>
      <div className={`${style.help} ${theme.help}`}>
        <ul className={`${style.helpList} ${theme.helpList}`}>
          <li>Keep this window open while using your mobile</li>
          <li>Your mobile link will expire in one hour</li>
        </ul>
      </div>
      <div href='#' className={style.cancel}
         onClick={preventDefaultOnClick(props.previousStep)}>Resend link
      </div>
    </div>
  </div>

export default trackComponent(MobileNotificationSent, 'mobile_notification_sent')
