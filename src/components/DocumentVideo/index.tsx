import { h, FunctionComponent } from 'preact'
import { useState } from 'preact/compat'

import { getInactiveError } from '~utils/inactiveError'
import { DOCUMENT_CAPTURE_LOCALES_MAPPING } from '~utils/localesMapping'
import { localised } from '../../locales'
import { DocumentOverlay } from '../Overlay'
import PageTitle from '../PageTitle'
import DocumentLiveCapture from '../Photo/DocumentLiveCapture'
import VideoCapture from '../VideoCapture'

import type { WithLocalisedProps, WithTrackingProps } from '~types/hocs'
import type { HandleCaptureProp, RenderFallbackProp } from '~types/routers'
import type { DocumentTypes } from '~types/steps'

type CaptureStep = 'front' | 'video' | 'back'
type RecordingStep = 'intro' | 'tilt' | 'flip'

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

  const handlePhotoCapture: HandleCaptureProp = (payload) => {
    console.log('handlePhotoCapture.payload:', payload)
    setCaptureStep('video')
  }

  const handleVideoRecordingStart = () => {
    console.log('handleVideoRecordingStart')
    setRecordingStep('tilt')
  }

  const handleVideoCapture: HandleCaptureProp = (payload) => {
    console.log('handleVideoCapture.payload', payload)
  }

  const handleNextRecordingStep = () => {
    console.log('handleNextRecordingStep')
  }

  if (captureStep === 'front' || captureStep === 'back') {
    const title = translate(
      DOCUMENT_CAPTURE_LOCALES_MAPPING[documentType][captureStep].title
    )

    return (
      <DocumentLiveCapture
        isUploadFallbackDisabled
        onCapture={handlePhotoCapture}
        renderFallback={renderFallback}
        renderTitle={<PageTitle title={title} smaller />}
        trackScreen={trackScreen}
      />
    )
  }

  const inactiveError = getInactiveError(true)

  return (
    <VideoCapture
      cameraClassName={cameraClassName}
      inactiveError={inactiveError}
      onRecordingStart={handleVideoRecordingStart}
      onVideoCapture={handleVideoCapture}
      renderFallback={renderFallback}
      renderOverlay={() => <DocumentOverlay type={documentType} />}
      recordingProps={{
        hasMoreSteps: recordingStep !== 'flip',
        onNext: handleNextRecordingStep,
      }}
      trackScreen={trackScreen}
    />
  )
}

export default localised(DocumentVideo)
