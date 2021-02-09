import { h, FunctionComponent } from 'preact'
import { useContext, useRef, useState } from 'preact/compat'
import Webcam from 'react-webcam-onfido'

import { mimeType } from '~utils/blob'
import { screenshot } from '~utils/camera'
import { getInactiveError } from '~utils/inactiveError'
import { DOC_VIDEO_INSTRUCTIONS_MAPPING } from '~utils/localesMapping'
import { LocaleContext } from '~locales'
import { DocumentOverlay } from '../Overlay'
import VideoCapture, {
  VideoLayerProps as VideoLayerRenderProps,
} from '../VideoCapture'
import Instructions from './Instructions'
import Recording from './Recording'
import StartRecording from './StartRecording'

import type { CaptureSteps, CaptureVariants, TiltModes } from '~types/docVideo'
import type { WithTrackingProps } from '~types/hocs'
import type { CapturePayload } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocVideoCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'

const TILT_MODE: TiltModes = 'right'

const renamedCapture = (
  payload: CapturePayload,
  step: CaptureVariants
): CapturePayload => ({
  ...payload,
  filename: `document_${step}.${mimeType(payload.blob)}`,
})

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

export type Props = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
  onCapture: HandleDocVideoCaptureProp
} & WithTrackingProps

const DocumentVideo: FunctionComponent<Props> = ({
  cameraClassName,
  documentType,
  onCapture,
  renderFallback,
  trackScreen,
}) => {
  const [captureStep, setCaptureStep] = useState<CaptureSteps>('intro')
  const [frontPayload, setFrontPayload] = useState<CapturePayload>(null)
  const { translate } = useContext(LocaleContext)
  const webcamRef = useRef<Webcam>(null)

  const onRecordingStart = () => {
    setCaptureStep('front')

    screenshot(webcamRef.current, (blob, sdkMetadata) => {
      const frontPayload = renamedCapture(
        {
          blob,
          sdkMetadata,
        },
        'front'
      )

      setFrontPayload(frontPayload)
    })
  }

  const onVideoCapture: HandleCaptureProp = (payload) => {
    const videoPayload = renamedCapture(payload, 'video')

    if (documentType === 'passport') {
      onCapture({
        front: frontPayload,
        video: videoPayload,
      })
      return
    }

    screenshot(webcamRef.current, (blob, sdkMetadata) => {
      const backPayload = renamedCapture(
        {
          blob,
          sdkMetadata,
        },
        'back'
      )

      onCapture({
        front: frontPayload,
        video: videoPayload,
        back: backPayload,
      })
    })
  }

  const localeKeys =
    documentType === 'passport' && captureStep !== 'back'
      ? DOC_VIDEO_INSTRUCTIONS_MAPPING.passport[captureStep]
      : DOC_VIDEO_INSTRUCTIONS_MAPPING.others[captureStep]
  const title = translate(localeKeys.title)
  const subtitle = translate(localeKeys.subtitle)

  const passedProps = {
    captureStep,
    title,
    subtitle,
  }

  /* const recordingSteps: CaptureSteps[] =
    documentType === 'passport' ? ['front', 'tilt'] : ['front', 'tilt', 'back'] */

  /* hasMoreSteps={
            recordingSteps.indexOf(captureStep) === recordingSteps.length - 1
          }
          onNext={() => {
            const currentStepIndex = recordingSteps.indexOf(captureStep)
            if (currentStepIndex >= recordingSteps.length - 1) {
              return
            }
            const nextStep =
              recordingSteps[recordingSteps.indexOf(captureStep) + 1]
            setCaptureStep(nextStep)
          }} */

  return (
    <VideoCapture
      cameraClassName={cameraClassName}
      facing="environment"
      inactiveError={getInactiveError(true)}
      onRecordingStart={onRecordingStart}
      onRedo={() => setCaptureStep('intro')}
      onVideoCapture={onVideoCapture}
      recordingTimeout={30}
      renderFallback={renderFallback}
      renderOverlay={() => (
        <DocumentOverlay
          marginBottom={0.5}
          tilt={captureStep === 'tilt' ? TILT_MODE : undefined}
          type={documentType}
          withPlaceholder={captureStep === 'intro'}
        />
      )}
      renderVideoLayer={(props) => (
        <VideoLayer
          {...props}
          {...passedProps}
          hasMoreSteps={
            documentType === 'passport'
              ? captureStep !== 'tilt'
              : captureStep !== 'back'
          }
          onNext={() => {
            if (captureStep === 'front') {
              setCaptureStep('tilt')
            } else if (captureStep === 'tilt') {
              setCaptureStep('back')
            }
          }}
        />
      )}
      trackScreen={trackScreen}
      webcamRef={webcamRef}
    />
  )
}

export default DocumentVideo
