import { h } from 'preact'
import Title from 'components/Title'
import Collapsible from 'components/Collapsible'
import theme from 'components/Theme/style.css'
import {preventDefaultOnClick} from 'components/utils'
import { trackComponent } from 'Tracker'
import style from './style.css'
import { localised } from '../../../../locales'

const Permissions = ({onNext, t}) => (
  <div>
    <Title title={t('webcam_permissions.allow_access')} />
    <div className={theme.thickWrapper}>
      {t('webcam_permissions.enable_webcam_for_selfie')}
      <div className={style.image}>
        <p>{t('webcam_permissions.click_allow')}</p>
        <div className={style.graphic}>
          <span className={style.allow}>{t('webcam_permissions.allow')}</span>
        </div>
      </div>
      <Collapsible trigger={t('webcam_permissions.why')} className={style.reasons}>
        <p className={style.reason}>{t('webcam_permissions.if_denied')}</p>
      </Collapsible>
      <button
        href=''
        className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}
        onClick={preventDefaultOnClick(onNext)}>
        {t('webcam_permissions.enable_webcam')}
      </button>
    </div>
  </div>
)

export default trackComponent(localised(Permissions))
