import { h } from 'preact'
import PageTitle from 'components/PageTitle'
import theme from 'components/Theme/style.css'
import style from './style.css'
import Button from 'components/Button'
import { trackComponent } from 'Tracker'
import { localised } from '../../../locales'

const Recover = ({translate}) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle
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
      <Button
        className={style.button}
        variants={["primary", "lg"]}
        onClick={() => window.location.reload()}
      >
        {translate('webcam_permissions.refresh')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(Recover))
