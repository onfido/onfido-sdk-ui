import { DocumentOverlay } from 'components/Overlay'
import VideoCapture, { VideoOverlayProps } from 'components/VideoCapture'
import { h } from 'preact'
import { useEffect, useRef, useState } from 'preact/hooks'
import Webcam from '~webcam/react-webcam'
import { trackComponent, trackException } from 'Tracker'
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
import CaptureInstructions from './CaptureInstructions'

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

const DocumentMultiFrame = ({
  cameraClassName,
  documentType,
  trackScreen,
  renderFallback,
  onCapture,
  side,
}: DocumentMultiFrameProps) => {
  const webcamRef = useRef<Webcam | null>(null)

  const { nextRecordState, nextStep, recordState } = useMultiFrameCaptureStep()

  const [photoPayload, setPhotoPayload] = useState<CapturePayload | undefined>(
    undefined
  )

  const [videoPayload, setVideoPayload] = useState<CapturePayload | undefined>(
    undefined
  )

  useEffect(() => {
    if (recordState === 'placeholder') {
      setTimeout(nextRecordState, DOC_MULTIFRAME_CAPTURE.PLACEHOLDER_TIMEOUT)
    }
  }, [recordState, nextRecordState])

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
    if (webcamRef.current) {
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
  }

  const onVideoCapture: HandleCaptureProp = (payload) => {
    setVideoPayload(appendFileName(payload, side))
  }

  const onRedo = () => {
    setPhotoPayload(undefined)
    setVideoPayload(undefined)
  }

  const documentOverlayProps = {
    side,
    documentType,
    video: true,
    withPlaceholder: recordState === 'placeholder' && side === 'front',
  }

  const renderVideoOverlay = (videoOverlayProps: VideoOverlayProps) => {
    const instructionsProps = { recordState, side }
    const controlsProps = { ...videoOverlayProps, recordState, nextStep }

    return (
      <DocumentOverlay
        {...documentOverlayProps}
        header={<CaptureInstructions {...instructionsProps} />}
        footer={<CaptureControls {...controlsProps} />}
      />
    )
  }

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

export default trackComponent(DocumentMultiFrame)
