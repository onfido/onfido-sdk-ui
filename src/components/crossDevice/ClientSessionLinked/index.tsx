import { h, FunctionComponent } from 'preact'
import classNames from 'classnames'
import { Button } from '@onfido/castor-react'

import ScreenLayout from '../../Theme/ScreenLayout'
import PageTitle from '../../PageTitle'
import { trackComponent } from '../../../Tracker'
import { useLocales } from '~locales'
import theme from '../../Theme/style.scss'
import style from './style.scss'

import type { WithTrackingProps } from '~types/hocs'

type Props = {
  nextStep: () => void
} & WithTrackingProps

const ClientSessionLinked: FunctionComponent<Props> = ({ nextStep }) => {
  const { translate } = useLocales()
  return (
    <ScreenLayout
      actions={
        <Button
          variant="primary"
          className={classNames(theme['button-centered'], theme['button-lg'])}
          onClick={nextStep}
          data-onfido-qa="cross-device-linked-session-next-btn"
        >
          {translate('cross_device_linked_computer.button_primary')}
        </Button>
      }
      className={style.container}
    >
      <PageTitle
        title={translate('cross_device_linked_computer.title')}
        subTitle={translate('cross_device_linked_computer.subtitle')}
      />
      <div>
        PLACEHOLDER SCREEN
        <br />
        TODO: Cross device spam warning - default screen
      </div>
    </ScreenLayout>
  )
}

export default trackComponent(ClientSessionLinked, 'client_session_linked')
