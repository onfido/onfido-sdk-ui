import CameraButton from 'components/Button/CameraButton'
import { DocumentOverlay } from 'components/Overlay'
import VideoCapture from 'components/VideoCapture'
import { FunctionComponent, h } from 'preact'
import { useRef } from 'preact/hooks'
import { useSelector } from 'react-redux'
import Webcam from 'react-webcam-onfido'
import { CountryData } from '~types/commons'
import type { WithTrackingProps } from '~types/hocs'
import { RootState } from '~types/redux'
import type {
  HandleDocVideoCaptureProp,
  RenderFallbackProp,
} from '~types/routers'
import type { DocumentTypes } from '~types/steps'
import { getInactiveError } from '~utils/inactiveError'

export type DocumentMultiFrameProps = {
  cameraClassName?: string
  documentType: DocumentTypes
  renderFallback: RenderFallbackProp
  onCapture: HandleDocVideoCaptureProp
} & WithTrackingProps

const DocumentMultiFrame: FunctionComponent<DocumentMultiFrameProps> = ({
  cameraClassName,
  documentType,
  trackScreen,
  renderFallback,
}) => {
  const webcamRef = useRef<Webcam>()

  const issuingCountryData = useSelector<RootState, CountryData | undefined>(
    (state) => state.globals.idDocumentIssuingCountry
  )

  const onCapture = () => console.log('onCapture')
  const onRecordingStart = () => console.log('onRecordingStart')
  const onVideoCapture = () => console.log('onVideoCapture')
  const onRedo = () => console.log('onRedo')

  const documentOverlayProps = {
    documentType,
    issuingCountry: issuingCountryData?.country_alpha2,
    marginBottom: 0.5,
    upperScreen: true,
    video: true,
  }

  const renderVideoOverlay = () => {
    return (
      <DocumentOverlay {...documentOverlayProps}>
        <div>Instructions</div>
        <CameraButton
          ariaLabel={'video_capture.button_accessibility'}
          onClick={onCapture}
          className={''}
          disableInteraction={false}
        />
      </DocumentOverlay>
    )
  }
  return (
    <VideoCapture
      facing="environment"
      method="document"
      webcamRef={webcamRef}
      cameraClassName={cameraClassName}
      inactiveError={getInactiveError(true)}
      onRecordingStart={onRecordingStart}
      onRedo={onRedo}
      onVideoCapture={onVideoCapture}
      renderFallback={renderFallback}
      renderVideoOverlay={renderVideoOverlay}
      trackScreen={trackScreen}
    />
  )
}

export default DocumentMultiFrame
