import { h } from 'preact'
import classNames from 'classnames'
import PageTitle from 'components/PageTitle'
import { Button } from '@onfido/castor'
import { trackComponent } from 'Tracker'
import { localised } from '../../../locales'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

const Recover = ({ translate }) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle
      title={translate('permission_recovery.title_cam')}
      subTitle={translate('permission_recovery.subtitle_cam')}
    />
    <div className={theme.thickWrapper}>
      <div className={style.instructions}>
        <span className={style.recovery}>
          {translate('permission_recovery.info')}
        </span>
        <p className={style.instructionsTitle}>
          {translate('permission_recovery.list_header_cam')}
        </p>
        <ol className={style.steps}>
          {[
            'permission_recovery.list_item_how_to_cam',
            'permission_recovery.list_item_action_cam',
          ].map((localeKey) => (
            <li key={localeKey} className={style.step}>
              {translate(localeKey)}
            </li>
          ))}
        </ol>
      </div>
    </div>
    <div className={theme.thickWrapper}>
      <Button
        variant="primary"
        size="large" // REMOVE
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={() => window.location.reload()}
      >
        {translate('permission_recovery.button_primary')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(Recover))
