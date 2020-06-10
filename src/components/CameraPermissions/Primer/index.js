import { h } from 'preact'
import classNames from 'classnames'
import PageTitle from 'components/PageTitle'
import theme from 'components/Theme/style.css'
import Button from 'components/Button'
import { trackComponent } from 'Tracker'
import style from './style.css'
import { localised } from '../../../locales'

const Permissions = ({onNext, translate}) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle title={translate('webcam_permissions.allow_access')} subTitle={translate('webcam_permissions.enable_webcam_for_selfie')} />
    <div className={classNames(theme.thickWrapper, style.bodyWrapper, theme.scrollableContent)}>
      <div className={style.image}>
        <div className={style.graphic}></div>
      </div>
      <p className={style.instructions}>{translate('webcam_permissions.click_allow')}</p>
    </div>
    <div className={classNames(theme.thickWrapper, style.actions)}>
      <Button
        variants={["centered", "primary", "lg"]}
        onClick={onNext}
      >
        {translate('webcam_permissions.enable_webcam')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(Permissions))
