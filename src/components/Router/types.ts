import type { CaptureState } from 'components/ReduxAppWrapper/types'
import type { ComponentStep } from './StepComponentMap'
import { CameraDetectionProps } from '../Capture/withCameraDetection'

import type { FlowVariants, NarrowSdkOptions } from '~types/commons'
import type { ReduxProps } from 'components/App/withConnect'

export type ChangeFlowProp = (
  newFlow: FlowVariants,
  newStep?: number,
  excludeStepFromHistory?: boolean
) => void

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

export type RouterOwnProps = {
  options: NarrowSdkOptions
} & ReduxProps

type RouterBaseProps = RouterOwnProps & CameraDetectionProps

export type RouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
} & RouterBaseProps
