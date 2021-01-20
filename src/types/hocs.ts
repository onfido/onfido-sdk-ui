export type WithCameraDetectionProps = {
  hasCamera?: boolean
}

export type TrackScreenCallback = (
  screenNameHierarchy?: string | string[],
  properties?: Record<string, unknown>
) => void

export type WithTrackingProps = {
  trackScreen: TrackScreenCallback
}
