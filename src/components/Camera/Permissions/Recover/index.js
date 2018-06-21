import { h } from 'preact'
import Title from 'components/Title'
import Collapsible from 'components/Collapsible'
import theme from 'components/Theme/style.css'
import style from './style.css'
import {preventDefaultOnClick} from 'components/utils'
import { trackComponent } from 'Tracker'

const Recover = ({onNext, i18n}) => (
  <div>
    <Title title={i18n.t('webcam_permissions.access_denied')} />
    <div className={theme.thickWrapper}>
      {i18n.t('webcam_permissions.recover_access')}
      <div className={style.instructions}>
        <span className={style.recovery}>{i18n.t('webcam_permissions.recovery')}</span>
        <p>{i18n.t('webcam_permissions.follow_steps')}</p>
        <ol className={style.steps}>
        {
          ['grant_access', 'refresh_page'].map((key, index) =>
            <li key={key} className={style.step}>
              {i18n.t(`webcam_permissions.${key}`)}
            </li>
          )
        }
        </ol>
      </div>
      <button
        href=''
        className={`${theme.btn} ${theme["btn-centered"]} ${theme["btn-primary"]}`}
        onClick={preventDefaultOnClick(onNext)}>
        {i18n.t('webcam_permissions.refresh_page')}
      </button>
    </div>
  </div>
)

export default trackComponent(Recover)
