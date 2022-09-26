import { ComponentType, FunctionComponent, h } from 'preact'
import { connect } from 'react-redux'

import { buildCaptureStateKey } from '~utils/redux'
import { appendToTracking } from '../../Tracker'
import { localised } from '~locales'
import Confirm, { ConfirmProps } from './Confirm'
import { CapturePayload, RootState } from '~types/redux'
import { StepComponentProps } from '~types/routers'

const mapStateToProps = (
  { captures, globals: { isFullScreen, imageQualityRetries } }: RootState,
  { method, side }: ConfirmProps
) => ({
  capture: captures[
    buildCaptureStateKey({ method, side })
  ] as NonNullable<CapturePayload>,
  isFullScreen,
  imageQualityRetries,
})

const TrackedConfirm = appendToTracking(
  Confirm,
  'confirmation'
) as FunctionComponent<ConfirmProps>

const LocalisedTrackedConfirm = localised(
  TrackedConfirm
) as FunctionComponent<ConfirmProps>

// Note: Preact and Redux types don't play nice together, hence the type cast.
const MapConfirm = (connect(mapStateToProps)(
  LocalisedTrackedConfirm
) as unknown) as ComponentType<ConfirmProps>

const PoAFrontWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="poa" side="front" />
)

const DocumentFrontWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="document" side="front" />
)

const DocumentBackWrapper = (props: ConfirmProps) => (
  <MapConfirm {...props} method="document" side="back" />
)

const BaseFaceConfirm = (props: ConfirmProps) => (
  <MapConfirm {...props} method="face" />
)

const DocumentFrontConfirm = appendToTracking(
  DocumentFrontWrapper,
  'front'
) as ComponentType<StepComponentProps>

const DocumentBackConfirm = appendToTracking(
  DocumentBackWrapper,
  'back'
) as ComponentType<StepComponentProps>

const SelfieConfirm = appendToTracking(
  BaseFaceConfirm,
  'selfie'
) as ComponentType<StepComponentProps>

const FaceVideoConfirm = appendToTracking(
  BaseFaceConfirm,
  'face_video'
) as ComponentType<StepComponentProps>

const PoAConfirm = appendToTracking(
  PoAFrontWrapper,
  'poa'
) as ComponentType<StepComponentProps>

export {
  DocumentFrontConfirm,
  DocumentBackConfirm,
  SelfieConfirm,
  FaceVideoConfirm,
  PoAConfirm,
}
