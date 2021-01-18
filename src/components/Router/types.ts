import { EventEmitter2 } from 'eventemitter2'

import type { CaptureState } from 'components/ReduxAppWrapper/types'
import type { ComponentStep } from './StepComponentMap'
import { CameraDetectionProps } from '../Capture/withCameraDetection'

import type { FlowVariants, NormalisedSdkOptions } from '~types/commons'
import type { ReduxProps } from 'components/App/withConnect'

export type FlowChangeCallback = (
  newFlow: FlowVariants,
  newStep: number,
  previousFlow: FlowVariants,
  payload: {
    userStepIndex: number
    clientStepIndex: number
    clientStep: ComponentStep
  }
) => void

export type CaptureKeys = keyof CaptureState

export type StepIndexType = 'client' | 'user'

type OmittedSdkOptions = Omit<
  NormalisedSdkOptions,
  | 'containerEl'
  | 'containerId'
  | 'isModalOpen'
  | 'onModalRequestClose'
  | 'shouldCloseOnOverlayClick'
  | 'useModal'
> & {
  events?: EventEmitter2.emitter
}

export type RouterOwnProps = {
  options: OmittedSdkOptions
} & ReduxProps

type RouterBaseProps = RouterOwnProps & CameraDetectionProps

export type RouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
} & RouterBaseProps
