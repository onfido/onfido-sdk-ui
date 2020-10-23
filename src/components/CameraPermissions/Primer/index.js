import { h } from 'preact'
import classNames from 'classnames'
import PageTitle from 'components/PageTitle'
import { Button } from '@onfido/castor'
import { trackComponent } from 'Tracker'
import { localised } from '../../../locales'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

const Permissions = ({ onNext, translate }) => (
  <div className={theme.fullHeightContainer}>
    <PageTitle
      title={translate('permission.title_cam')}
      subTitle={translate('permission.subtitle_cam')}
    />
    <div
      className={classNames(
        theme.thickWrapper,
        style.bodyWrapper,
        theme.scrollableContent
      )}
    >
      <div className={style.image}>
        <div className={style.graphic} />
      </div>
      <p className={style.instructions}>{translate('permission.body_cam')}</p>
    </div>
    <div className={classNames(theme.thickWrapper, style.actions)}>
      <Button
        variant="primary"
        size="large"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={onNext}
        data-onfido-qa="enable-camera-btn"
      >
        {translate('permission.button_primary_cam')}
      </Button>
    </div>
  </div>
)

export default trackComponent(localised(Permissions))
