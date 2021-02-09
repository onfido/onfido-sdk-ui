import { h, FunctionComponent } from 'preact'
import { useContext } from 'preact/compat'

import { LocaleContext } from '~locales'
import Instructions from './Instructions'
import Recording from './Recording'
import StartRecording from './StartRecording'

import type { CaptureSteps, TiltModes } from '~types/docVideo'
import type { VideoLayerProps as VideoLayerRenderProps } from '../VideoCapture'

const TILT_MODE: TiltModes = 'right'

type VideoLayerProps = {
  captureStep: CaptureSteps
  hasMoreSteps: boolean
  onNext: () => void
  subtitle: string
  title: string
} & VideoLayerRenderProps

const VideoLayer: FunctionComponent<VideoLayerProps> = ({
  captureStep,
  disableInteraction,
  isRecording,
  hasMoreSteps,
  onNext,
  onStart,
  onStop,
  title,
  subtitle,
}) => {
  const { translate } = useContext(LocaleContext)

  if (!isRecording) {
    return (
      <StartRecording disableInteraction={disableInteraction} onClick={onStart}>
        <Instructions title={title} />
      </StartRecording>
    )
  }

  return (
    <Recording
      buttonText={translate(
        captureStep !== 'back'
          ? 'doc_video_capture.button_primary_next'
          : 'doc_video_capture.button_stop_accessibility'
      )}
      hasMoreSteps={hasMoreSteps}
      disableInteraction={disableInteraction}
      onNext={onNext}
      onStop={onStop}
    >
      <Instructions
        icon={captureStep}
        subtitle={subtitle}
        tiltMode={TILT_MODE}
        title={title}
      />
    </Recording>
  )
}

export default VideoLayer
