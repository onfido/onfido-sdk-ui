import { FunctionComponent, h } from 'preact'
import { Button } from '@onfido/castor-react'
import classNames from 'classnames'
import { trackComponent } from 'Tracker'
import { localised } from '~locales'
import PageTitle from 'components/PageTitle'
import ScreenLayout from 'components/Theme/ScreenLayout'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'

const localeKeys = {
  camera: {
    title: 'permission_recovery.title_cam',
    subTitle: 'permission_recovery.subtitle_cam',
    instructions: 'permission_recovery.list_header_cam',
    how_to: 'permission_recovery.list_item_how_to_cam',
  },
  microphoneAndCamera: {
    title: 'permission_recovery.title_both',
    subTitle: 'permission_recovery.subtitle_both',
    instructions: 'permission_recovery.list_header_both',
    how_to: 'permission_recovery.list_item_how_to_both',
  },
}

type RecoverProps = {
  audio?: boolean
}

type Props = RecoverProps & WithLocalisedProps & WithTrackingProps

const Recover: FunctionComponent<Props> = ({ translate, audio }) => {
  const locales = localeKeys[audio ? 'microphoneAndCamera' : 'camera']

  const actions = (
    <Button
      variant="primary"
      className={classNames(theme['button-centered'], theme['button-lg'])}
      onClick={() => window.location.reload()}
    >
      {translate('permission_recovery.button_primary')}
    </Button>
  )

  return (
    <ScreenLayout className={theme.fullHeightContainer} actions={actions}>
      <PageTitle
        title={translate(locales.title)}
        subTitle={translate(locales.subTitle)}
      />
      <div className={style.instructions}>
        <span className={style.recovery}>
          {translate('permission_recovery.info')}
        </span>
        <p className={style.instructionsTitle}>
          {translate(locales.instructions)}
        </p>
        <ol className={style.steps}>
          {[locales.how_to, 'permission_recovery.list_item_action_cam'].map(
            (localeKey) => (
              <li key={localeKey} className={style.step}>
                {translate(localeKey)}
              </li>
            )
          )}
        </ol>
      </div>
    </ScreenLayout>
  )
}

export default trackComponent(localised(Recover), 'camera_access_denied')
