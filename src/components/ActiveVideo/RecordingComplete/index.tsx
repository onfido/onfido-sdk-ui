import { h, FunctionComponent } from 'preact'
import { Button } from '../Button'
import { Footer } from '../Footer'
import { Header } from '../Header'
import { Wrapper } from '../Wrapper'
import { CameraIcon } from '../assets/CameraIcon'
import { BaseScreen } from '../BaseScreen'
import { localised } from '~locales'
import { StepComponentProps } from '~types/routers'
import { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import { trackComponent } from 'Tracker'

type Props = StepComponentProps & WithLocalisedProps & WithTrackingProps

const RecordingComplete: FunctionComponent<Props> = ({
  nextStep,
  translate,
  trackScreen,
}: Props) => {
  const handleUpload = (): void => {
    trackScreen('outro_upload_clicked')
    nextStep()
  }

  return (
    <BaseScreen>
      <Wrapper>
        <Header
          title={translate('avc_confirmation.title')}
          subtitle={translate('avc_confirmation.subtitle')}
        >
          <CameraIcon />
        </Header>
      </Wrapper>

      <Footer>
        <Button onClick={() => handleUpload()}>
          {translate('avc_confirmation.button_primary_upload')}
        </Button>
      </Footer>
    </BaseScreen>
  )
}

export default trackComponent(localised(RecordingComplete), 'outro')
