import { h, FunctionComponent } from 'preact'
import { Button } from '../Button'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { ErrorIcon } from '../assets/ErrorIcon'
import { Wrapper } from '../Wrapper'
import { BaseScreen } from '../BaseScreen'
import { localised } from '~locales'
import { trackComponent } from 'Tracker'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { StepComponentProps } from '~types/routers'

type Props = StepComponentProps &
  WithTrackingProps &
  WithLocalisedProps & {
    restart: () => void
    retry: () => void
  }

const ConnectionError: FunctionComponent<Props> = ({
  restart,
  retry,
  trackScreen,
  translate,
}: Props) => {
  const handleRestart = (): void => {
    trackScreen('connection_error_restart_clicked')
    restart()
  }

  const handleRetry = (): void => {
    trackScreen('connection_error_retry_clicked')
    retry()
  }

  return (
    <BaseScreen>
      <Wrapper>
        <Header title={translate('avc_connection_error.title')}>
          <ErrorIcon />
        </Header>
        {translate('avc_connection_error.subtitle')}
      </Wrapper>

      <Footer>
        <Button onClick={() => handleRetry()}>
          {translate('avc_connection_error.button_primary_retry_upload')}
        </Button>
        <Button onClick={() => handleRestart()}>
          {translate('avc_connection_error.button_secondary_restart_recording')}
        </Button>
      </Footer>
    </BaseScreen>
  )
}

export default trackComponent(localised(ConnectionError), 'connection_error')
