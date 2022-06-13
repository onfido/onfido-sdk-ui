import { FunctionComponent, h } from 'preact'
import classNames from 'classnames'
import PageTitle from 'components/PageTitle'
import ScreenLayout from 'components/Theme/ScreenLayout'
import { Button } from '@onfido/castor-react'
import { trackComponent } from 'Tracker'
import { localised } from '~locales'
import theme from 'components/Theme/style.scss'
import style from './style.scss'

import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'

type PermissionsProps = {
  onNext: () => void
  audio?: boolean
}

type Props = PermissionsProps & WithLocalisedProps & WithTrackingProps

const localeKeys = {
  camera: {
    title: 'permission.title_cam',
    subTitle: 'permission.subtitle_cam',
    body: 'permission.body_cam',
    button: 'permission.button_primary_cam',
  },
  microphoneAndCamera: {
    title: 'permission.title_both',
    subTitle: 'permission.subtitle_both',
    body: 'permission.body_both',
    button: 'permission.button_primary_both',
  },
}

const Permissions: FunctionComponent<Props> = ({
  onNext,
  translate,
  audio,
}) => {
  const locales = localeKeys[audio ? 'microphoneAndCamera' : 'camera']

  const actions = (
    <Button
      type="button"
      variant="primary"
      className={classNames(theme['button-centered'], theme['button-lg'])}
      onClick={onNext}
      data-onfido-qa="enable-camera-btn"
    >
      {translate(locales.button)}
    </Button>
  )

  return (
    <ScreenLayout
      pageId={'Permission'}
      className={classNames(theme.fullHeightContainer, style.bodyWrapper)}
      actions={actions}
    >
      <PageTitle
        title={translate(locales.title)}
        subTitle={translate(locales.subTitle)}
      />
      <div className={classNames(style.image, audio ? style.twoImages : '')}>
        <div className={style.cameraAllow} />
        {audio && <div className={style.microphone} />}
      </div>
      <p className={style.instructions}>{translate(locales.body)}</p>
    </ScreenLayout>
  )
}

export default trackComponent(localised(Permissions), 'camera_access')
