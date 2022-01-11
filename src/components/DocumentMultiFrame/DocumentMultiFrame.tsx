import { DocumentOverlay } from 'components/Overlay'
import VideoCapture, { VideoOverlayProps } from 'components/VideoCapture'
import { FunctionComponent, h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import Webcam from 'react-webcam-onfido'
import { trackException } from 'Tracker'
import { DocumentSides } from '~types/commons'
import type { WithTrackingProps } from '~types/hocs'
import { CapturePayload } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocMultiFrameCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'
import { mimeType } from '~utils/blob'
import { screenshot } from '~utils/camera'
import { DOC_MULTIFRAME_CAPTURE } from '~utils/constants'
import { getInactiveError } from '~utils/inactiveError'
import CaptureControls from './CaptureControls'
import useMultiFrameCaptureStep from './useMultiFrameCaptureStep'

const appendFileName = (
  payload: CapturePayload,
  side: DocumentSides
): CapturePayload => ({
  ...payload,
  filename: `document_${side}.${mimeType(payload.blob)}`,
})

export type DocumentMultiFrameProps = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
  onCapture: HandleDocMultiFrameCaptureProp
  side: DocumentSides
} & WithTrackingProps

const DocumentMultiFrame: FunctionComponent<DocumentMultiFrameProps> = ({
  cameraClassName,
  documentType,
  trackScreen,
  renderFallback,
  onCapture,
  side,
}) => {
  const webcamRef = useRef<Webcam>()

  const { nextRecordState, nextStep, recordState } = useMultiFrameCaptureStep()

  const [photoPayload, setPhotoPayload] = useState<CapturePayload | undefined>(
    undefined
  )

  const [videoPayload, setVideoPayload] = useState<CapturePayload | undefined>(
    undefined
  )

  useEffect(() => {
    if (recordState === 'scanning') {
      setTimeout(nextRecordState, DOC_MULTIFRAME_CAPTURE.SCANNING_TIMEOUT)
    }
  }, [recordState, nextRecordState])

  useEffect(() => {
    if (recordState === 'success') {
      setTimeout(nextRecordState, DOC_MULTIFRAME_CAPTURE.SUCCESS_STATE_TIMEOUT)
    }
  }, [recordState, nextRecordState])

  useEffect(() => {
    if (recordState === 'submit') {
      if (!photoPayload || !videoPayload) {
        console.error('Missing photoPayload or videoPayload')
        trackException('Missing photoPayload or videoPayload')
        return
      }

      if (navigator.vibrate) {
        navigator.vibrate(DOC_MULTIFRAME_CAPTURE.SUCCESS_STATE_VIBRATION)
      }

      onCapture({
        photo: photoPayload,
        video: videoPayload,
      })
    }
  }, [recordState, photoPayload, videoPayload, onCapture])

  const onRecordingStart = () => {
    screenshot(webcamRef.current, (blob, sdkMetadata) => {
      setPhotoPayload(
        appendFileName(
          {
            blob,
            sdkMetadata,
          },
          side
        )
      )
    })
  }

  const onVideoCapture: HandleCaptureProp = (payload) => {
    setVideoPayload(appendFileName(payload, side))
  }

  const onRedo = () => {
    setPhotoPayload(undefined)
    setVideoPayload(undefined)
  }

  const documentOverlayProps = {
    documentType,
    side,
    upperScreen: true,
    video: true,
    withPlaceholder: recordState === 'idle',
  }

  const renderVideoOverlay = (videoOverlayProps: VideoOverlayProps) => (
    <DocumentOverlay {...documentOverlayProps}>
      <CaptureControls
        {...videoOverlayProps}
        side={side}
        recordState={recordState}
        nextStep={nextStep}
      />
    </DocumentOverlay>
  )
  return (
    <VideoCapture
      cameraClassName={cameraClassName}
      facing="environment"
      inactiveError={getInactiveError(true)}
      method="document"
      onRecordingStart={onRecordingStart}
      onRedo={onRedo}
      onVideoCapture={onVideoCapture}
      renderFallback={renderFallback}
      renderVideoOverlay={renderVideoOverlay}
      trackScreen={trackScreen}
      webcamRef={webcamRef}
    />
  )
}

export default DocumentMultiFrame
