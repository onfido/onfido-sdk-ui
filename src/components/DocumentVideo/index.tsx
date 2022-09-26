import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useRef, useState } from 'preact/compat'
import { useSelector } from 'react-redux'
import Webcam from '~webcam/react-webcam'

import { mimeType } from '~utils/blob'
import { screenshot } from '~utils/camera'
import { DOC_VIDEO_CAPTURE } from '~utils/constants'
import { getInactiveError } from '~utils/inactiveError'
import { trackException } from 'Tracker'
import DocumentOverlay from '../Overlay/DocumentOverlay'
import VideoCapture, { VideoOverlayProps } from '../VideoCapture'
import PaperIdFlowSelector from './PaperIdFlowSelector'
import CaptureControls from './CaptureControls'

import type { CountryData } from '~types/commons'
import type {
  CaptureVariants,
  CaptureFlows,
  CaptureSteps,
} from '~types/docVideo'
import type { WithTrackingProps } from '~types/hocs'
import type { RootState, CapturePayload } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocVideoCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'

const renamedCapture = (
  payload: CapturePayload,
  step: CaptureVariants
): CapturePayload => ({
  ...payload,
  filename: [`document_${step}`, mimeType(payload.blob)]
    .filter((str) => str != null)
    .join('.'),
})

const getCaptureFlow = (
  documentType: DocumentTypes,
  issuingCountry?: string
): CaptureFlows | undefined => {
  if (documentType === 'passport') {
    return 'passport'
  }

  if (
    (documentType === 'driving_licence' && issuingCountry === 'FR') ||
    (documentType === 'national_identity_card' && issuingCountry === 'IT')
  ) {
    return undefined
  }

  return 'cardId'
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
  const issuingCountryData = useSelector<RootState, CountryData | undefined>(
    (state) => state.globals.idDocumentIssuingCountry
  )

  const [captureFlow, setCaptureFlow] = useState(
    getCaptureFlow(documentType, issuingCountryData?.country_alpha2)
  )
  const [showOverlayPlaceholder, setShowOverlayPlaceholder] = useState(true)
  const [flowComplete, setFlowComplete] = useState(false)

  /**
   * Because every flow control was placed inside CaptureControls _except_ restart,
   * and the redo event was controlled from VideoCapture,
   * we need a mechanism to trigger flow restart from outside.
   * This state will be incremented every time VideoCapture ask for redo,
   * hence CaptureControls will be updated with a new value and then restart the flow
   */
  const [flowRestartTrigger, setFlowRestartTrigger] = useState(0)

  const [frontPayload, setFrontPayload] = useState<CapturePayload | undefined>(
    undefined
  )
  const [backPayload, setBackPayload] = useState<CapturePayload | undefined>(
    undefined
  )
  const [videoPayload, setVideoPayload] = useState<CapturePayload | undefined>(
    undefined
  )
  const webcamRef = useRef<Webcam | null>(null)

  useEffect(() => {
    if (captureFlow == null) {
      return
    }

    setTimeout(
      () => setShowOverlayPlaceholder(false),
      DOC_VIDEO_CAPTURE.CAMERA_OVERLAY_TIMEOUT
    )
  }, [captureFlow])

  useEffect(() => {
    if (!flowComplete) {
      return
    }

    if (!frontPayload || !videoPayload) {
      console.error('Missing frontPayload or videoPayload')
      trackException('Missing frontPayload or videoPayload')
      return
    }

    if (documentType === 'passport') {
      onCapture({
        front: frontPayload,
        video: videoPayload,
      })
    } else {
      onCapture({
        front: frontPayload,
        video: videoPayload,
        back: backPayload,
      })
    }
  }, [flowComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  const onRecordingStart = () => {
    if (webcamRef.current) {
      screenshot(webcamRef.current, (blob, sdkMetadata) => {
        const frontCapture = renamedCapture(
          {
            blob,
            sdkMetadata,
          },
          'front'
        )

        setFrontPayload(frontCapture)
      })
    }
  }

  const onVideoCapture: HandleCaptureProp = (payload) => {
    const videoCapture = renamedCapture(payload, 'video')
    setVideoPayload(videoCapture)

    if (documentType === 'passport') {
      return
    }

    if (webcamRef.current) {
      screenshot(webcamRef.current, (blob, sdkMetadata) => {
        const backCapture = renamedCapture(
          {
            blob,
            sdkMetadata,
          },
          'back'
        )

        setBackPayload(backCapture)
      })
    }
  }

  const issuingCountry = issuingCountryData?.country_alpha2

  const docOverlayProps = {
    documentType,
    isPaperId: captureFlow === 'paperId',
    issuingCountry,
    upperScreen: true,
    video: true,
    withPlaceholder: showOverlayPlaceholder,
  }

  const captureControlsProps = {
    documentType,
    flowRestartTrigger,
    onStepChange: (step: CaptureSteps) => {
      if (showOverlayPlaceholder && step !== 'intro') {
        setShowOverlayPlaceholder(false)
      }
    },
    onSubmit: () => setFlowComplete(true),
  }

  const renderVideoOverlay = (props: VideoOverlayProps) => {
    const overlayFooter = captureFlow ? (
      <CaptureControls
        {...props}
        {...captureControlsProps}
        captureFlow={captureFlow}
      />
    ) : (
      <PaperIdFlowSelector
        documentType={documentType}
        onSelectFlow={setCaptureFlow}
      />
    )

    return <DocumentOverlay {...docOverlayProps} footer={overlayFooter} />
  }

  return (
    <VideoCapture
      cameraClassName={cameraClassName}
      facing="environment"
      inactiveError={getInactiveError(true)}
      method="document"
      onRecordingStart={onRecordingStart}
      onRedo={() => setFlowRestartTrigger((prevTrigger) => prevTrigger + 1)}
      onVideoCapture={onVideoCapture}
      renderFallback={renderFallback}
      renderVideoOverlay={renderVideoOverlay}
      trackScreen={trackScreen}
      webcamRef={webcamRef}
      pageId={'DocumentVideoCapture'}
    />
  )
}

export default memo(DocumentVideo)
