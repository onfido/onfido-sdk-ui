import { h, ComponentType } from 'preact'

import type { ErrorCallback } from './api'
import type {
  ExtendedStepConfig,
  FlowVariants,
  NarrowSdkOptions,
  MobileConfig,
  ErrorNames,
  ErrorTypes,
} from './commons'
import type { CaptureVariants } from './docVideo'
import type { WithCameraDetectionProps, WithTrackingProps } from './hocs'
import type {
  StepOptionWelcome,
  StepOptionDocument,
  StepOptionPoA,
  StepOptionFace,
  StepOptionComplete,
  StepConfig,
} from './steps'
import type { CapturePayload } from './redux'
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

export type HandleCaptureProp = (payload: CapturePayload) => void
export type HandleDocVideoCaptureProp = (
  payload: Partial<Record<CaptureVariants, CapturePayload>>
) => void

export type RenderFallbackProp = (
  text: string,
  callback?: () => void
) => h.JSX.Element

export type ErrorProp = {
  name: ErrorNames
  type?: ErrorTypes
}

export type WithSdkOptionsProps = {
  options: NarrowSdkOptions
}

export type ExternalRouterProps = WithSdkOptionsProps &
  ReduxProps &
  WithCameraDetectionProps

export type InternalRouterProps = {
  allowCrossDeviceFlow: boolean
  onFlowChange?: FlowChangeCallback
} & ExternalRouterProps

export type HistoryRouterProps = {
  crossDeviceClientError?: (name?: string) => void
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
  triggerOnError: ErrorCallback
} & HistoryRouterProps

type StepComponentBaseProps = {
  resetSdkFocus: () => void
} & Omit<
  StepsRouterProps,
  | 'disableNavigation'
  | 'cobrand'
  | 'hideOnfidoLogo'
  | 'isFullScreen'
  | 'options'
> &
  NarrowSdkOptions &
  WithTrackingProps

export type StepComponentWelcomeProps = StepOptionWelcome &
  StepComponentBaseProps
export type StepComponentUserConsentProps = StepComponentBaseProps
export type StepComponentDocumentProps = StepOptionDocument &
  StepComponentBaseProps
export type StepComponentPoaProps = StepOptionPoA & StepComponentBaseProps
export type StepComponentFaceProps = StepOptionFace & StepComponentBaseProps
export type StepComponentCompleteProps = StepOptionComplete &
  StepComponentBaseProps

export type StepComponentProps =
  | StepComponentWelcomeProps
  | StepComponentUserConsentProps
  | StepComponentDocumentProps
  | StepComponentPoaProps
  | StepComponentFaceProps
  | StepComponentCompleteProps

export type ComponentStep = {
  component: ComponentType<StepComponentProps>
  step: ExtendedStepConfig
  stepIndex: number
}
