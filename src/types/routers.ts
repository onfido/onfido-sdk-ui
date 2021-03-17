import { h, ComponentType } from 'preact'
import { ActionCreatorsMapObject } from 'redux'

import type { ErrorCallback } from './api'
import type {
  ExtendedStepConfig,
  FlowVariants,
  NarrowSdkOptions,
  MobileConfig,
  ErrorNames,
  ErrorTypes,
} from './commons'
import type { WithCameraDetectionProps, WithTrackingProps } from './hocs'
import type {
  StepOptionDocument,
  StepOptionPoA,
  StepOptionFace,
  StepOptionComplete,
  StepConfig,
} from './steps'
import type {
  CombinedActions,
  CaptureState,
  GlobalState,
  CapturePayload,
} from './redux'

// @TODO: deprecate this props to consume `useSelector` and `useDispatch` hooks instead
export type ReduxProps = {
  actions: ActionCreatorsMapObject<CombinedActions>
  captures: CaptureState
} & GlobalState

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

export type HandleCaptureProp = (payload: CapturePayload) => void

export type RenderFallbackProp = (
  text: string,
  callback?: () => void
) => h.JSX.Element

export type ErrorProp = {
  name: ErrorNames
  type?: ErrorTypes
}

export type ExternalRouterProps = ReduxProps & WithCameraDetectionProps

export type InternalRouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
  // @TODO: remove this prop completely to consume useSdkOptions() hook instead
  options: NarrowSdkOptions
} & ExternalRouterProps

export type HistoryRouterProps = {
  crossDeviceClientError?: (name?: ErrorNames) => void
  mobileConfig?: MobileConfig
  sendClientSuccess?: () => void
  step?: number
  stepIndexType?: StepIndexType
  steps?: StepConfig[]
} & InternalRouterProps

export type StepsRouterProps = {
  back: () => void
  changeFlowTo: ChangeFlowProp
  componentsList: ComponentStep[]
  disableNavigation: boolean
  nextStep: () => void
  previousStep: () => void
  step: number
  triggerOnError: ErrorCallback
} & HistoryRouterProps

export type StepComponentBaseProps = {
  resetSdkFocus: () => void
} & Omit<
  StepsRouterProps,
  | 'disableNavigation'
  | 'cobrand'
  | 'logoCobrand'
  | 'hideOnfidoLogo'
  | 'isFullScreen'
  | 'options'
> &
  NarrowSdkOptions &
  WithTrackingProps

export type StepComponentDocumentProps = StepOptionDocument &
  StepComponentBaseProps
export type StepComponentPoaProps = StepOptionPoA & StepComponentBaseProps
export type StepComponentFaceProps = StepOptionFace & StepComponentBaseProps
export type StepComponentCompleteProps = StepOptionComplete &
  StepComponentBaseProps

export type StepComponentProps =
  | StepComponentBaseProps
  | StepComponentDocumentProps
  | StepComponentPoaProps
  | StepComponentFaceProps
  | StepComponentCompleteProps

export type ComponentStep = {
  component: ComponentType<StepComponentProps>
  step: ExtendedStepConfig
  stepIndex: number
}
