import type { ChallengePayload } from './api'
import type {
  SupportedLanguages,
  TranslatedTagParser,
  TranslateCallback,
} from './locales'

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
