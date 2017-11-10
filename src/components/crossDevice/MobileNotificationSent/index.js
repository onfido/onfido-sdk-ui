import { h } from 'preact'

import theme from '../../Theme/style.css'
import style from './style.css'
import { trackComponent } from '../../../Tracker'
import {preventDefaultOnClick} from '../../utils'

const MobileNotificationSent = (props) => {
  return (
    <div className={theme.step}>
      <h1 className={`${theme.title} ${theme.center}`}>Check your mobile</h1>
      <div className={style.submessage}>
        We’ve sent a secure link to {props.mobileNumber}
        <p>It may take a few minutes to arrive</p>
      </div>
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
  )
}

export default trackComponent(MobileNotificationSent, 'mobile_notification_sent')
