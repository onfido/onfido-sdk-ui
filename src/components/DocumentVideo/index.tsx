import { h, FunctionComponent } from 'preact'
import { useContext, useState } from 'preact/compat'

import { getInactiveError } from '~utils/inactiveError'
import { mimeType } from '~utils/blob'
import { DOC_VIDEO_INSTRUCTIONS_MAPPING } from '~utils/localesMapping'
import { LocaleContext } from '~locales'
import { DocumentOverlay } from '../Overlay'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import VideoCapture from '../VideoCapture'
import Instructions from './Instructions'
import Recording from './Recording'
import StartRecording from './StartRecording'

import type { CaptureSteps, RecordingSteps } from '~types/docVideo'
import type { WithTrackingProps } from '~types/hocs'
import type { CapturePayload } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocVideoCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'

export type Props = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
  onCapture: HandleDocVideoCaptureProp
} & WithTrackingProps

const renamedCapture = (
  payload: CapturePayload,
  step: CaptureSteps
): CapturePayload => ({
  ...payload,
  filename: `document_${step}.${mimeType(payload.blob)}`,
})

const DocumentVideo: FunctionComponent<Props> = ({
  cameraClassName,
  documentType,
  onCapture,
  renderFallback,
  trackScreen,
}) => {
  const [captureStep, setCaptureStep] = useState<CaptureSteps>('front')
  const [recordingStep, setRecordingStep] = useState<RecordingSteps>('intro')
  const [frontPayload, setFrontPayload] = useState<CapturePayload>(null)
  const [videoPayload, setVideoPayload] = useState<CapturePayload>(null)
  const { translate } = useContext(LocaleContext)

  const handleFrontCapture: HandleCaptureProp = (payload) => {
    setFrontPayload(renamedCapture(payload, 'front'))
    setCaptureStep('video')
  }

  const handleVideoCapture: HandleCaptureProp = (payload) => {
    setVideoPayload(renamedCapture(payload, 'video'))
    setCaptureStep('back')
  }

  const handleBackCapture: HandleCaptureProp = (payload) => {
    onCapture({
      front: frontPayload,
      video: videoPayload,
      back: renamedCapture(payload, 'back'),
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
      facing="environment"
      inactiveError={getInactiveError(true)}
      onRecordingStart={() => setRecordingStep('tilt')}
      onRedo={() => setRecordingStep('intro')}
      onVideoCapture={handleVideoCapture}
      renderFallback={renderFallback}
      renderOverlay={() => <DocumentOverlay type={documentType} videoCapture />}
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

export default DocumentVideo
