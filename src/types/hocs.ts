import type { ChallengePayload } from './api'
import type { DocumentSides } from './commons'
import type {
  SupportedLanguages,
  TranslatedTagParser,
  TranslateCallback,
} from './locales'
import type { RequestedVariant } from './steps'
import { AnalyticsTrackedEventNames } from './tracker'

export type WithChallengesProps = {
  challenges: ChallengePayload[]
  challengesId: string
}

export type WithLocalisedProps = {
  language?: SupportedLanguages
  parseTranslatedTags: TranslatedTagParser
  translate: TranslateCallback
  loading?: boolean
}

export type WithCameraDetectionProps = {
  hasCamera?: boolean | null
}

export type WithFailureHandlingProps = {
  onError?: (error: Error) => void
}

export type TrackedEvent = {
  event: AnalyticsTrackedEventNames // this is informative only, it will not be used as a source of truth (yet). It's there to help the developer understand what event is declared here.
  properties: Record<string, unknown>
}

export type TrackEventBeforeMountCallback = () => TrackedEvent

export type TrackScreenCallback = (
  screenNameHierarchy?: string | string[],
  properties?: Record<string, unknown>
) => void

export type WithTrackingProps = {
  trackScreen: TrackScreenCallback
  trackEventBeforeMount?: TrackEventBeforeMountCallback
}

export type WithCaptureVariantProps = {
  forceCrossDevice?: boolean
  isPoA?: boolean
  requestedVariant?: RequestedVariant
  side?: DocumentSides
}

export type WithPageIdProps = {
  pageId?: string
}

export type WithThemeProps = {
  back?: () => void
  disableNavigation?: boolean
}

export type WithPermissionsFlowProps = {
  hasGrantedPermission?: boolean
}

export type WithBlobPreviewProps = {
  blob: Blob
}

export type WithNavigationDisabledStateProps = {
  isNavigationDisabled?: boolean
}

export type WithNavigationDisabledActionProps = {
  setNavigationDisabled: (value: boolean) => void
}
