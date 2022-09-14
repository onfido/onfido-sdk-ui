import { h, ComponentType, ComponentChildren } from 'preact'
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
import type { ParsedTag } from './locales'
import type {
  StepOptionDocument,
  StepOptionPoA,
  StepOptionFace,
  StepOptionData,
  StepOptionComplete,
  StepOptionAuth,
  StepConfig,
  StepOptionRetry,
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
  payload: {
    clientStepIndex: number
    clientSteps: StepConfig[]
  }
) => void

export type ChangeFlowProp = (
  newFlow: FlowVariants,
  newStep?: number,
  excludeStepFromHistory?: boolean
) => void

export type HandleCaptureProp = (payload: CapturePayload) => void
export type HandleDocVideoCaptureProp = (payload: {
  front: CapturePayload
  back?: CapturePayload
  video: CapturePayload
}) => void

export type HandleDocMultiFrameCaptureProp = (payload: {
  photo: CapturePayload
  video: CapturePayload
}) => void

export type RenderFallbackProp = (
  tag: ParsedTag,
  callback?: () => void
) => h.JSX.Element | string | null

export type ErrorProp = {
  name: ErrorNames
  type?: ErrorTypes
  properties?: Record<string, unknown>
  analyticsProperties?: Record<string, unknown>
}

export type ExternalRouterProps = ReduxProps & WithCameraDetectionProps

export type InternalRouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
  // @TODO: remove this prop completely to consume useSdkOptions() hook instead
  options: NarrowSdkOptions
  triggerOnError: ErrorCallback
} & ExternalRouterProps

type HistoryRouterBaseProps = {
  crossDeviceClientError?: (name?: ErrorNames) => void
  mobileConfig?: MobileConfig
  sendClientSuccess?: () => void
  step?: number
  stepIndexType?: StepIndexType
  workflowRunId?: string
} & InternalRouterProps

export type HistoryRouterWrapperProps = HistoryRouterBaseProps & {
  useSteps: StepsHook
  fallback?: ComponentChildren
}

export type HistoryRouterProps = HistoryRouterBaseProps & {
  loadNextStep: (p: () => void, flow?: FlowVariants) => void
  completeStep: (data: CompleteStepValue) => void
  hasNextStep: boolean
  hasPreviousStep: boolean
  steps: StepConfig[]
}

export type StepsRouterProps = {
  back: () => void
  changeFlowTo: ChangeFlowProp
  componentsList: ComponentStep[]
  disableNavigation: boolean
  nextStep: () => void
  previousStep: () => void
  step: number
  isLoadingStep?: boolean
  completeStep: (data: CompleteStepValue) => void
} & HistoryRouterBaseProps

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
  Omit<NarrowSdkOptions, 'language'> &
  WithTrackingProps

export type StepComponentDocumentProps = StepOptionDocument &
  StepComponentBaseProps
export type StepComponentPoaProps = StepOptionPoA & StepComponentBaseProps
export type StepComponentFaceProps = StepOptionFace & StepComponentBaseProps
export type StepComponentDataProps = StepOptionData & StepComponentBaseProps
export type StepComponentCompleteProps = StepOptionComplete &
  StepComponentBaseProps
export type StepComponentAuthProps = StepOptionAuth & StepComponentBaseProps
export type StepComponentRetryProps = StepOptionRetry & StepComponentBaseProps

export type StepComponentProps =
  | StepComponentBaseProps
  | StepComponentDocumentProps
  | StepComponentPoaProps
  | StepComponentFaceProps
  | StepComponentDataProps
  | StepComponentCompleteProps
  | StepComponentAuthProps
  | StepComponentRetryProps

export type ComponentStep = {
  component: ComponentType<StepComponentProps>
  step: ExtendedStepConfig
  stepIndex: number
}

export type HistoryLocationState = {
  step: number
  flow: FlowVariants
}

export type StepperState = {
  loadingStep: boolean
  steps: StepConfig[]
  taskId: string | null
  completed: boolean
  serviceError: string | null
  personalData: unknown
  docData: unknown[]
}

export type CompleteStepValue = Array<{ id: string }> | Record<string, unknown>

export type StepsHook = () => {
  loadNextStep: (p: () => void, flow?: FlowVariants) => void
  completeStep: (data: CompleteStepValue) => void
  loading: boolean
  hasNextStep: boolean
  hasPreviousStep: boolean
  steps: StepConfig[] | undefined
  error: string | undefined
}
