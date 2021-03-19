import { h, FunctionComponent } from 'preact'
import { memo, useEffect, useRef, useState } from 'preact/compat'
import Webcam from 'react-webcam-onfido'

import { mimeType } from '~utils/blob'
import { screenshot } from '~utils/camera'
import { getInactiveError } from '~utils/inactiveError'
import VideoCapture from '../VideoCapture'
import VideoLayer from './VideoLayer'

import { CaptureVariants, CaptureFlows } from '~types/docVideo'
import type { WithTrackingProps } from '~types/hocs'
import type { CapturePayload } from '~types/redux'
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

const getCaptureFlow = (documentType: DocumentTypes): CaptureFlows => {
  if (documentType === 'passport') {
    return 'passport'
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
  const captureFlow = getCaptureFlow(documentType)

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

  const passedProps = {
    captureFlow,
    documentType,
    flowRestartTrigger,
    onSubmit: () => setFlowComplete(true),
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
      renderVideoLayer={(props) => <VideoLayer {...props} {...passedProps} />}
      trackScreen={trackScreen}
      webcamRef={webcamRef}
    />
  )
}

export default memo(DocumentVideo)
