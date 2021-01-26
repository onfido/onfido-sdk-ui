import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'

import { getInactiveError } from '~utils/inactiveError'
import { DOC_VIDEO_INSTRUCTIONS_MAPPING } from '~utils/localesMapping'
import { localised } from '~locales'
import { DocumentOverlay } from '../Overlay'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import VideoCapture from '../VideoCapture'
import Instructions from './Instructions'
import Recording from './Recording'
import StartRecording from './StartRecording'

import type { CaptureSteps, RecordingSteps } from '~types/docVideo'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { CapturePayload } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocVideoCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'

export type DocumentVideoProps = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
  onCapture: HandleDocVideoCaptureProp
} & WithTrackingProps

type Props = DocumentVideoProps & WithLocalisedProps

const DocumentVideo: FunctionComponent<Props> = ({
  cameraClassName,
  documentType,
  onCapture,
  renderFallback,
  translate,
  trackScreen,
}) => {
  const [captureStep, setCaptureStep] = useState<CaptureSteps>('front')
  const [recordingStep, setRecordingStep] = useState<RecordingSteps>('intro')
  const [frontPayload, setFrontPayload] = useState<CapturePayload>(null)
  const [videoPayload, setVideoPayload] = useState<CapturePayload>(null)

  const handleFrontCapture: HandleCaptureProp = (payload) => {
    setFrontPayload(payload)
    setCaptureStep('video')
  }

  const handleVideoCapture: HandleCaptureProp = (payload) => {
    setVideoPayload(payload)
    setCaptureStep('back')
  }

  const handleBackCapture: HandleCaptureProp = (payload) => {
    onCapture({
      front: frontPayload,
      video: videoPayload,
      back: payload,
    })
  }

  if (captureStep === 'front' || captureStep === 'back') {
    const title = translate(
      DOC_VIDEO_INSTRUCTIONS_MAPPING[captureStep][documentType]
    )

    return (
      <DocumentLiveCapture
        documentType={documentType}
        isUploadFallbackDisabled
        onCapture={
          captureStep === 'front' ? handleFrontCapture : handleBackCapture
        }
        renderFallback={renderFallback}
        trackScreen={trackScreen}
      >
        <Instructions title={title} />
      </DocumentLiveCapture>
    )
  }

  const title = translate(
    DOC_VIDEO_INSTRUCTIONS_MAPPING.video[recordingStep].title
  )
  const subtitle = translate(
    DOC_VIDEO_INSTRUCTIONS_MAPPING.video[recordingStep].subtitle
  )

  return (
    <VideoCapture
      cameraClassName={cameraClassName}
      inactiveError={getInactiveError(true)}
      onRecordingStart={() => setRecordingStep('tilt')}
      onRedo={() => setRecordingStep('intro')}
      onVideoCapture={handleVideoCapture}
      renderFallback={renderFallback}
      renderOverlay={() => <DocumentOverlay type={documentType} />}
      renderVideoLayer={({
        disableInteraction,
        isRecording,
        onStart,
        onStop,
      }) =>
        isRecording ? (
          <Recording
            hasMoreSteps={recordingStep !== 'flip'}
            disableInteraction={disableInteraction}
            onNext={() => setRecordingStep('flip')}
            onStop={onStop}
          >
            <Instructions
              icon={recordingStep}
              title={title}
              subtitle={subtitle}
            />
          </Recording>
        ) : (
          <StartRecording
            disableInteraction={disableInteraction}
            onClick={onStart}
          />
        )
      }
      trackScreen={trackScreen}
    />
  )
}

export default localised(DocumentVideo)
