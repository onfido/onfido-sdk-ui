import type { ComponentType } from 'preact'

import type { ApiRequest } from '~types/api'
import type {
  ExtendedStepConfig,
  FlowVariants,
  NarrowSdkOptions,
} from '~types/commons'
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

export type TriggerOnErrorProp = (response: ApiRequest) => void

export type StepIndexType = 'client' | 'user'

export type ComponentStep = {
  component: ComponentType
  step: ExtendedStepConfig
  stepIndex: number
}

export type RouterOwnProps = {
  options: NarrowSdkOptions
} & ReduxProps

export type CameraDetectionProps = {
  hasCamera?: boolean
}

export type RouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
} & RouterOwnProps &
  CameraDetectionProps
