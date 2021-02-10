import { h, Ref } from 'preact'
import Webcam from 'react-webcam-onfido'

import type { RenderFallbackProp } from './routers'

export type ButtonType = 'photo' | 'video'

export type CameraProps = {
  buttonType?: ButtonType
  children?: h.JSX.Element | h.JSX.Element[]
  className?: string
  containerClassName?: string
  facing?: VideoFacingModeEnum
  idealCameraHeight?: number
  isButtonDisabled?: boolean
  isRecording?: boolean
  isUploadFallbackDisabled?: boolean
  onButtonClick?: () => void
  renderError?: h.JSX.Element
  renderTitle?: h.JSX.Element
  renderFallback: RenderFallbackProp
  video?: boolean
  webcamRef?: Ref<Webcam>
}
