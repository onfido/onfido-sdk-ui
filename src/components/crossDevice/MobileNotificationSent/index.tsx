import { h, FunctionComponent } from 'preact'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { preventDefaultOnClick } from '~utils'
import { useLocales } from '~locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'

import type { WithTrackingProps } from '~types/hocs'
import { SmsPayload } from '~types/redux'

type MobileNotificationSentProps = {
  sms: SmsPayload
  previousStep: () => void
}

type Props = MobileNotificationSentProps & WithTrackingProps

const MobileNotificationSent: FunctionComponent<Props> = ({
  sms,
  previousStep,
}) => {
  const { translate } = useLocales()
  return (
    <div data-page-id={'MobileNotificationSent'}>
      <PageTitle title={translate('sms_sent.title')} />
      <div>
        <div className={style.submessage}>
          {translate('sms_sent.subtitle', {
            number: sms?.number,
          })}
        </div>
        <div className={style.boldMessage}>
          {translate('sms_sent.subtitle_minutes')}
        </div>
        <span className={`${theme.icon} ${style.icon}`} />
        <div role="heading" aria-level="2" className={theme.header}>
          {translate('sms_sent.info')}
        </div>
        <div className={`${style.help} ${theme.help}`}>
          <ul
            className={theme.helpList}
            aria-label={translate('sms_sent.info')}
          >
            <li>{translate('sms_sent.info_link_window')}</li>
            <li>{translate('sms_sent.info_link_expire')}</li>
          </ul>
        </div>
        <a
          href="#"
          role="button"
          className={`${theme.link} ${style.cancel}`}
          onClick={preventDefaultOnClick(previousStep)}
        >
          {translate('sms_sent.link')}
        </a>
      </div>
    </div>
  )
}

export default trackComponent(
  MobileNotificationSent,
  'mobile_notification_sent'
)
