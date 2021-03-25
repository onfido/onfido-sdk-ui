import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useRef, useState } from 'preact/compat'
import { useSelector } from 'react-redux'
import Webcam from 'react-webcam-onfido'

import { mimeType } from '~utils/blob'
import { screenshot } from '~utils/camera'
import { getInactiveError } from '~utils/inactiveError'
import DocumentOverlay, {
  calculateHollowRect,
} from '../Overlay/DocumentOverlay'
import VideoCapture, { VideoOverlayProps } from '../VideoCapture'
import PaperIdFlowSelector from './PaperIdFlowSelector'
import VideoLayer from './VideoLayer'

import type { CountryData } from '~types/commons'
import type { CaptureVariants, CaptureFlows } from '~types/docVideo'
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
  filename: `document_${step}.${mimeType(payload.blob)}`,
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
  const [flowComplete, setFlowComplete] = useState(false)

  /**
   * Because every flow control was placed inside VideoLayer _except_ restart,
   * and the redo event was controlled from VideoCapture,
   * we need a mechanism to trigger flow restart from outside.
   * This state will be incremented every time VideoCapture ask for redo,
   * hence VideoLayer will be updated with a new value and then restart the flow
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
  const webcamRef = useRef<Webcam>(null)

  useEffect(() => {
    if (!flowComplete) {
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

  const onVideoCapture: HandleCaptureProp = (payload) => {
    const videoCapture = renamedCapture(payload, 'video')
    setVideoPayload(videoCapture)

    if (documentType === 'passport') {
      return
    }

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

  const issuingCountry = issuingCountryData?.country_alpha2

  const overlayBottomMargin = 0.5
  const documentOverlayProps = {
    documentType,
    isPaperId: captureFlow === 'paperId',
    issuingCountry,
  }
  const overlayHollowRect = calculateHollowRect(
    documentOverlayProps,
    overlayBottomMargin
  )

  const passedProps = {
    documentType,
    flowRestartTrigger,
    footerHeightLimit: overlayHollowRect.bottom,
    onSubmit: () => setFlowComplete(true),
  }

  const renderVideoOverlay = (props: VideoOverlayProps) => {
    if (!captureFlow) {
      return (
        <PaperIdFlowSelector
          documentType={documentType}
          onSelectFlow={setCaptureFlow}
        />
      )
    }

    return (
      <VideoLayer
        {...props}
        {...passedProps}
        captureFlow={captureFlow}
        renderOverlay={(props) => (
          <DocumentOverlay
            {...props}
            {...documentOverlayProps}
            marginBottom={overlayBottomMargin}
          />
        )}
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
      onRedo={() => setFlowRestartTrigger((prevTrigger) => prevTrigger + 1)}
      onVideoCapture={onVideoCapture}
      renderFallback={renderFallback}
      renderVideoOverlay={renderVideoOverlay}
      trackScreen={trackScreen}
      webcamRef={webcamRef}
    />
  )
}

export default memo(DocumentVideo)
