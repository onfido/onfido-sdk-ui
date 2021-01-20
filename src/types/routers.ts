import type { ComponentType } from 'preact'

import type { ApiRequest } from './api'
import type {
  ExtendedStepConfig,
  FlowVariants,
  NarrowSdkOptions,
  ErrorNames,
  ErrorTypes,
} from './commons'
import type { WithCameraDetectionProps, WithTrackingProps } from './hocs'
import type {
  StepOptionWelcome,
  StepOptionDocument,
  StepOptionPoA,
  StepOptionFace,
  StepOptionComplete,
} from './steps'
import type { ReduxProps } from 'components/App/withConnect'

export type StepIndexType = 'client' | 'user'

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

export type ChangeFlowProp = (
  newFlow: FlowVariants,
  newStep?: number,
  excludeStepFromHistory?: boolean
) => void

export type TriggerOnErrorProp = (response: ApiRequest) => void

export type ErrorProp = {
  name: ErrorNames
  type?: ErrorTypes
}

export type PropsFromRouter = {
  back: () => void
  changeFlowTo: ChangeFlowProp
  componentsList: ComponentStep[]
  nextStep: () => void
  previousStep: () => void
  triggerOnError: TriggerOnErrorProp
  step: number
}

type StepComponentBaseProps = {
  resetSdkFocus: () => void
} & ReduxProps &
  NarrowSdkOptions &
  PropsFromRouter &
  WithCameraDetectionProps &
  WithTrackingProps

export type StepComponentWelcomeProps = StepOptionWelcome &
  StepComponentBaseProps
export type StepComponentDocumentProps = StepOptionDocument &
  StepComponentBaseProps
export type StepComponentPoaProps = StepOptionPoA & StepComponentBaseProps
export type StepComponentFaceProps = StepOptionFace & StepComponentBaseProps
export type StepComponentCompleteProps = StepOptionComplete &
  StepComponentBaseProps

export type StepComponentProps =
  | StepComponentWelcomeProps
  | StepComponentDocumentProps
  | StepComponentPoaProps
  | StepComponentFaceProps
  | StepComponentCompleteProps

export type ComponentStep = {
  component: ComponentType<StepComponentProps>
  step: ExtendedStepConfig
  stepIndex: number
}

export type RouterOwnProps = {
  options: NarrowSdkOptions
} & ReduxProps

export type RouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
} & RouterOwnProps &
  WithCameraDetectionProps
