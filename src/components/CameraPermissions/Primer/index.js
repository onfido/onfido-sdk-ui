import { h } from 'preact'
import Title from 'components/Title'
import Collapsible from 'components/Collapsible'
import theme from 'components/Theme/style.css'
import {preventDefaultOnClick} from '~utils'
import Button from 'components/Button'
import { trackComponent } from 'Tracker'
import style from './style.css'
import { localised } from '../../../locales'

const Permissions = ({onNext, translate}) => (
  <div className={style.container}>
    <Title title={translate('webcam_permissions.allow_access')} />
    <div className={theme.thickWrapper}>
      {translate('webcam_permissions.enable_webcam_for_selfie')}
      <div className={style.image}>
        <p>{translate('webcam_permissions.click_allow')}</p>
        <div className={style.graphic}>
          <span className={style.allow}>{translate('webcam_permissions.allow')}</span>
        </div>
      </div>
      <Collapsible trigger={translate('webcam_permissions.why')} className={style.reasons}>
        <p className={style.reason}>{translate('webcam_permissions.if_denied')}</p>
      </Collapsible>
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
