import { h } from 'preact'
import Title from 'components/Title'
import theme from 'components/Theme/style.css'
import style from './style.css'
import {preventDefaultOnClick} from 'components/utils'
import { trackComponent } from 'Tracker'

const Recover = ({onRefresh, i18n}) => (
  <div className={theme.fullHeightContainer}>
    <Title title={i18n.t('webcam_permissions.access_denied')} />
    <div className={theme.thickWrapper}>
      {i18n.t('webcam_permissions.recover_access')}
      <div className={style.instructions}>
        <span className={style.recovery}>{i18n.t('webcam_permissions.recovery')}</span>
        <p className={style.instructionsTitle}>{i18n.t('webcam_permissions.follow_steps')}</p>
        <ol className={style.steps}>
        {
          ['grant_access', 'refresh_page'].map(key =>
            <li key={key} className={style.step}>
              {i18n.t(`webcam_permissions.${key}`)}
            </li>
          )
        }
        </ol>
      </div>
    </div>
    <div className={theme.thickWrapper}>
      <button
        href=''
        className={`${style.button} ${theme.btn} ${theme["btn-primary"]}`}
        onClick={preventDefaultOnClick(onRefresh)}>
        {i18n.t('webcam_permissions.refresh')}
      </button>
    </div>
  </div>
)

export default trackComponent(Recover)
