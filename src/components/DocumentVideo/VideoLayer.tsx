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
  onNext: () => void
  step: CaptureSteps
  stepNumber: number
  subtitle: string
  title: string
  totalSteps: number
} & VideoLayerRenderProps

const VideoLayer: FunctionComponent<VideoLayerProps> = ({
  disableInteraction,
  isRecording,
  onNext,
  onStart,
  onStop,
  step,
  stepNumber,
  subtitle,
  title,
  totalSteps,
}) => {
  const { translate } = useContext(LocaleContext)

  if (!isRecording) {
    return (
      <StartRecording
        disableInteraction={disableInteraction}
        onClick={onStart}
        totalSteps={totalSteps}
      >
        <Instructions title={title} />
      </StartRecording>
    )
  }

  return (
    <Recording
      buttonText={translate(
        step !== 'back'
          ? 'doc_video_capture.button_primary_next'
          : 'doc_video_capture.button_stop_accessibility'
      )}
      hasMoreSteps={stepNumber < totalSteps}
      disableInteraction={disableInteraction}
      onNext={onNext}
      onStop={onStop}
    >
      <Instructions
        icon={step}
        subtitle={subtitle}
        tiltMode={TILT_MODE}
        title={title}
      />
    </Recording>
  )
}

export default VideoLayer
