import { EventEmitter2 } from 'eventemitter2'

import type { ComponentStep } from './StepComponentMap'
import { CameraDetectionProps } from '../Capture/withCameraDetection'

import type { FlowVariants, NormalisedSdkOptions } from '~types/commons'
import type { ReduxProps } from 'components/App/withConnect'

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

type RouterOwnProps = {
  options: OmittedSdkOptions
} & ReduxProps

type RouterProps = RouterOwnProps & CameraDetectionProps

type FlowChangeCallback = (
  newFlow: FlowVariants,
  newStep: number,
  previousFlow: FlowVariants,
  payload: {
    userStepIndex: number
    clientStepIndex: number
    clientStep: ComponentStep
  }
) => void

export type InternalRouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
} & RouterProps
