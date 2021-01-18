import type { ComponentType } from 'preact'

import type { ApiRequest } from '~types/api'
import type {
  ExtendedStepConfig,
  FlowVariants,
  NarrowSdkOptions,
} from '~types/commons'
import type {
  StepOptionWelcome,
  StepOptionDocument,
  StepOptionPoA,
  StepOptionFace,
  StepOptionComplete,
} from '~types/steps'
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

export type TrackScreenProp = (
  screenNameHierarchy: string | string[],
  properties?: Record<string, unknown>
) => void

export type TriggerOnErrorProp = (response: ApiRequest) => void

export type StepIndexType = 'client' | 'user'

export type CameraDetectionProps = {
  hasCamera?: boolean
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
  trackScreen: TrackScreenProp
} & ReduxProps &
  NarrowSdkOptions &
  PropsFromRouter &
  CameraDetectionProps

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
  CameraDetectionProps
