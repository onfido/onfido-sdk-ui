import { h } from 'preact'
import PageTitle from 'components/PageTitle'
import theme from 'components/Theme/style.css'
import {preventDefaultOnClick} from 'components/utils'
import Button from 'components/Button'
import { trackComponent } from 'Tracker'
import style from './style.css'
import { localised } from '../../../locales'

const Permissions = ({onNext, translate}) => (
  <div className={`${style.container} ${theme.fullHeightContainer}`}>
    <PageTitle title={translate('webcam_permissions.allow_access')} subTitle={translate('webcam_permissions.enable_webcam_for_selfie')} />
    <div className={`${theme.thickWrapper} ${style.bodyWrapper}`}>
      <p className={style.instructions}>{translate('webcam_permissions.click_allow')}</p>
      <div className={style.image}>
        <div className={style.graphic}>
          <span className={style.allow}>{translate('webcam_permissions.allow')}</span>
        </div>
      </div>
      <Button
        variants={["centered", "primary"]}
        onClick={preventDefaultOnClick(onNext)}
      >
        {translate('webcam_permissions.enable_webcam')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(Permissions))
