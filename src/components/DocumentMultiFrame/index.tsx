import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useRef, useState } from 'preact/compat'
import { useSelector } from 'react-redux'
import Webcam from 'react-webcam-onfido'

import { mimeType } from '~utils/blob'
import { screenshot } from '~utils/camera'
import { getInactiveError } from '~utils/inactiveError'
import DocumentOverlay from '../Overlay/DocumentOverlay'
import VideoCapture, { VideoOverlayProps } from '../VideoCapture'
import CaptureControls from './CaptureControls'

import type { CountryData, DocumentSides } from '~types/commons'
import type { WithTrackingProps } from '~types/hocs'
import type { RootState, CapturePayload } from '~types/redux'
import type {
  HandleCaptureProp,
  HandleDocMultiFrameCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'

const appendFileName = (
  payload: CapturePayload,
  side: DocumentSides
): CapturePayload => ({
  ...payload,
  filename: `document_${side}.${mimeType(payload.blob)}`,
})

export type Props = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
  side: DocumentSides
  onCapture: HandleDocMultiFrameCaptureProp
} & WithTrackingProps

const DocumentMultiFrame: FunctionComponent<Props> = ({
  cameraClassName,
  documentType,
  onCapture,
  renderFallback,
  side,
  trackScreen,
}) => {
  const issuingCountryData = useSelector<RootState, CountryData | undefined>(
    (state) => state.globals.idDocumentIssuingCountry
  )

  const [showOverlayPlaceholder, setShowOverlayPlaceholder] = useState(true)
  const [flowComplete, setFlowComplete] = useState(false)
  const [photoPayload, setPhotoPayload] = useState<CapturePayload | undefined>(
    undefined
  )
  const [videoPayload, setVideoPayload] = useState<CapturePayload | undefined>(
    undefined
  )
  const webcamRef = useRef<Webcam>()

  useEffect(() => {
    if (!flowComplete) {
      return
    }

    if (!photoPayload || !videoPayload) {
      throw new Error('Missing photoPayload or videoPayload')
    }

    onCapture({
      [side]: photoPayload,
      video: videoPayload,
    })
  }, [flowComplete]) // eslint-disable-line react-hooks/exhaustive-deps

  const onRecordingStart = () => {
    screenshot(webcamRef.current, (blob, sdkMetadata) => {
      const photoCapture = appendFileName(
        {
          blob,
          sdkMetadata,
        },
        side
      )

      setPhotoPayload(photoCapture)
    })
  }

  const onVideoCapture: HandleCaptureProp = (payload) => {
    const videoCapture = appendFileName(payload, side)
    setVideoPayload(videoCapture)
  }

  const issuingCountry = issuingCountryData?.country_alpha2

  const docOverlayProps = {
    documentType,
    issuingCountry,
    upperScreen: true,
    video: true,
    withPlaceholder: showOverlayPlaceholder,
  }

  const renderVideoOverlay = (props: VideoOverlayProps) => {
    const overridenProps = {
      ...props,
      documentType,
      onStart: () => {
        setShowOverlayPlaceholder(false)
        props.onStart()
      },
      side,
    }

    return (
      <DocumentOverlay {...docOverlayProps}>
        <CaptureControls
          {...overridenProps}
          onSubmit={() => setFlowComplete(true)}
        />
      </DocumentOverlay>
    )
  }

  const videoCaptureProps = {
    cameraClassName,
    onRecordingStart,
    onVideoCapture,
    renderFallback,
    renderVideoOverlay,
    trackScreen,
    webcamRef,
  }

  return (
    <VideoCapture
      {...videoCaptureProps}
      facing="environment"
      inactiveError={getInactiveError(true)}
      method="document"
      onRedo={() => setPhotoPayload(undefined)}
    />
  )
}

export default memo(DocumentMultiFrame)
