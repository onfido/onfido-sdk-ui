import type { ChallengePayload } from './api'
import type { DocumentSides } from './commons'
import type {
  SupportedLanguages,
  TranslatedTagParser,
  TranslateCallback,
} from './locales'
import type { RequestedVariant } from './steps'

export type WithChallengesProps = {
  challenges: ChallengePayload[]
  challengesId: string
}

export type WithLocalisedProps = {
  language: SupportedLanguages
  parseTranslatedTags: TranslatedTagParser
  translate: TranslateCallback
}

export type WithCameraDetectionProps = {
  hasCamera?: boolean
}

export type WithFailureHandlingProps = {
  onError?: (error: Error) => void
}

export type TrackScreenCallback = (
  screenNameHierarchy?: string | string[],
  properties?: Record<string, unknown>
) => void

export type WithTrackingProps = {
  trackScreen: TrackScreenCallback
}

export type WithOptionsProps = {
  forceCrossDevice?: boolean
  isPoA?: boolean
  requestedVariant?: RequestedVariant
  side?: DocumentSides
}

export type WithThemeProps = {
  back?: () => void
  disableNavigation?: boolean
}

export type WithPermissionsFlowProps = {
  hasGrantedPermission?: boolean
}
