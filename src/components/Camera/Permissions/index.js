import { h } from 'preact'
import Title from '../../Title'
import Collapsible from '../../Collapsible'
import theme from '../../Theme/style.css'
import style from './style.css'
import {preventDefaultOnClick} from '../../utils'
import { trackComponent } from '../../../Tracker'

const Permissions = ({nextStep, i18n}) => {
  return (
    <div>
      <Title title={i18n.t('webcam_permissions.allow_access')} />
      <div className={theme.thickWrapper}>
        {i18n.t('webcam_permissions.enable_webcam_for_selfie')}
        <div className={style.image}>
          <p>{i18n.t('webcam_permissions.click_allow')}</p>
          <div className={style.graphic}>
            <span className={style.allow}>{i18n.t('webcam_permissions.allow')}</span>
          </div>
        </div>
        <Collapsible trigger={i18n.t('webcam_permissions.why')} className={style.reasons}>
          <p className={style.reason}>{i18n.t('webcam_permissions.if_denied')}</p>
        </Collapsible>
        <button
          href=''
          className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}
          onClick={preventDefaultOnClick(nextStep)}>
          {i18n.t('webcam_permissions.enable_webcam')}
        </button>
      </div>
    </div>
  )
}

export default trackComponent(Permissions)
