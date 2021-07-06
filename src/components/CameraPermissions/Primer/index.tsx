import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import ScreenLayout from 'components/Theme/ScreenLayout'
import PageTitle from 'components/PageTitle'
import { Button } from '@onfido/castor-react'
import { trackComponent } from 'Tracker'
import { localised } from '~locales'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'

type PermissionsProps = {
  onNext: () => void
}

type Props = PermissionsProps & WithLocalisedProps & WithTrackingProps

const Permissions: FunctionComponent<Props> = ({ onNext, translate }) => (
  <ScreenLayout
    actions={
      <Button
        variant="primary"
        className={classNames(theme['button-centered'], theme['button-lg'])}
        onClick={onNext}
        data-onfido-qa="enable-camera-btn"
      >
        {translate('permission.button_primary_cam')}
      </Button>
    }
  >
    <div className={theme.fullHeightContainer}>
      <PageTitle
        title={translate('permission.title_cam')}
        subTitle={translate('permission.subtitle_cam')}
      />
      <div className={classNames(style.bodyWrapper)}>
        <div className={style.image}>
          <div className={style.graphic} />
        </div>
        <p className={style.instructions}>{translate('permission.body_cam')}</p>
      </div>
    </div>
  </ScreenLayout>
)

export default trackComponent(localised(Permissions))
