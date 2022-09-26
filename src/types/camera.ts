import { h, Ref } from 'preact'
import Webcam from '~webcam/react-webcam'

import type { WithPermissionsFlowProps } from './hocs'
import type { RenderFallbackProp } from './routers'

export type ButtonType = 'photo' | 'video' | 'none'

export type CameraProps = {
  audio?: boolean
  buttonType: ButtonType
  className?: string
  containerClassName?: string
  docAutoCaptureFrame?: boolean
  docLiveCaptureFrame?: boolean
  facing?: VideoFacingModeEnum
  fallbackToDefaultWidth?: boolean
  idealCameraWidth?: number
  isButtonDisabled?: boolean
  isUploadFallbackDisabled?: boolean
  onButtonClick?: () => void
  renderError?: h.JSX.Element | null
  renderFallback: RenderFallbackProp
  renderTitle?: h.JSX.Element | null
  renderVideoOverlay?: (props: WithPermissionsFlowProps) => h.JSX.Element
  webcamRef?: Ref<Webcam>
}
