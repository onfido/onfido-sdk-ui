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

import type { CaptureStep, RecordingStep } from '~types/docVideo'
import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { CapturePayload } from '~types/redux'
import type { HandleCaptureProp, RenderFallbackProp } from '~types/routers'
import type { DocumentTypes } from '~types/steps'

export type DocumentVideoProps = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
} & WithTrackingProps

type Props = DocumentVideoProps & WithLocalisedProps

const DocumentVideo: FunctionComponent<Props> = ({
  cameraClassName,
  documentType,
  renderFallback,
  translate,
  trackScreen,
}) => {
  const [captureStep, setCaptureStep] = useState<CaptureStep>('front')
  const [recordingStep, setRecordingStep] = useState<RecordingStep>('intro')
  const [photoPayload, setPhotoPayload] = useState<CapturePayload>(null)

  const handlePhotoCapture: HandleCaptureProp = (payload) => {
    setPhotoPayload(payload)
    setCaptureStep('video')
  }

  const handleVideoCapture: HandleCaptureProp = (payload) => {
    console.log('handleVideoCapture.payload', payload)
  }

  if (captureStep === 'front' || captureStep === 'back') {
    const title = translate(
      DOC_VIDEO_INSTRUCTIONS_MAPPING[captureStep][documentType]
    )

    return (
      <DocumentLiveCapture
        documentType={documentType}
        isUploadFallbackDisabled
        onCapture={handlePhotoCapture}
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
            <Instructions title={title} subtitle={subtitle} />
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
