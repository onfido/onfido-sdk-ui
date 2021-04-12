import { h, FunctionComponent } from 'preact'
import { memo, useRef, useState } from 'preact/compat'
import { useSelector } from 'react-redux'
import Webcam from 'react-webcam-onfido'

// import { screenshot } from '~utils/camera'
import { getInactiveError } from '~utils/inactiveError'
import DocumentOverlay from '../Overlay/DocumentOverlay'
import VideoCapture from '../VideoCapture'

import type { CountryData, DocumentSides } from '~types/commons'
import type { WithTrackingProps } from '~types/hocs'
import type { RootState, CapturePayload } from '~types/redux'
import type {
  // HandleCaptureProp,
  HandleDocVideoCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'

export type Props = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
  side: DocumentSides
  onCapture: HandleDocVideoCaptureProp
} & WithTrackingProps

const DocumentMultiFrame: FunctionComponent<Props> = ({
  cameraClassName,
  documentType,
  // onCapture,
  renderFallback,
  trackScreen,
}) => {
  const issuingCountryData = useSelector<RootState, CountryData | undefined>(
    (state) => state.globals.idDocumentIssuingCountry
  )

  const [flowRestartTrigger, setFlowRestartTrigger] = useState(0)

  const [photoPayload, setPhotoPayload] = useState<CapturePayload | undefined>(
    undefined
  )
  const [videoPayload, setVideoPayload] = useState<CapturePayload | undefined>(
    undefined
  )
  const webcamRef = useRef<Webcam>()

  const onRecordingStart = () => {
    console.log('onRecordingStart')
  }

  const onVideoCapture = () => {
    console.log('onVideoCapture')
  }

  const issuingCountry = issuingCountryData?.country_alpha2

  const docOverlayProps = {
    documentType,
    issuingCountry,
    marginBottom: 0.5,
    upperScreen: true,
    video: true,
  }

  const renderVideoOverlay = () => (
    <DocumentOverlay {...docOverlayProps}>
      <div>CaptureControls</div>
    </DocumentOverlay>
  )

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
      onRedo={() => setFlowRestartTrigger((prevTrigger) => prevTrigger + 1)}
    />
  )
}

export default memo(DocumentMultiFrame)
