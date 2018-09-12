import { h } from 'preact'
import Title from 'components/Title'
import theme from 'components/Theme/style.css'
import style from './style.css'
import {preventDefaultOnClick} from 'components/utils'
import { trackComponent } from 'Tracker'
import { localised } from '../../../../locales'

const Recover = ({onRefresh, translate}) => (
  <div className={theme.fullHeightContainer}>
    <Title
      title={translate('webcam_permissions.access_denied')}
      subTitle={translate('webcam_permissions.recover_access')}
    />
    <div className={theme.thickWrapper}>
      <div className={style.instructions}>
        <span className={style.recovery}>{translate('webcam_permissions.recovery')}</span>
        <p className={style.instructionsTitle}>{translate('webcam_permissions.follow_steps')}</p>
        <ol className={style.steps}>
        {
          ['grant_access', 'refresh_page'].map(key =>
            <li key={key} className={style.step}>
              {translate(`webcam_permissions.${key}`)}
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
        {translate('webcam_permissions.refresh')}
      </button>
    </div>
  </div>
)

export default trackComponent(localised(Recover))
