export interface ApplyFilter {
  doc_type?: string
}

export interface BiometricsLiveness {
  active?: BiometricsLivenessActive
  passive?: BiometricsLivenessPassive
}

export interface BiometricsLivenessActive {
  enabled?: boolean
  video_settings?: BiometricsLivenessActiveVideoSettings
}

export interface BiometricsLivenessActiveVideoSettings {
  framerate?: number
  bitrate?: number
  duration?: number
  focusLock?: boolean
  white_balanceLock?: boolean
  exposure_lock?: boolean
  codec?: string
  codec_profile?: number
}

export interface BiometricsLivenessPassive {
  enabled?: boolean
  video_settings?: BiometricsLivenessPassiveVideoSettings
}

export interface BiometricsLivenessPassiveVideoSettings {
  framerate?: number
  bitrate?: number
  duration?: number
  focus_lock?: boolean
  white_balance_lock?: boolean
  exposure_lock?: boolean
  codec?: string
}

export interface DocumentCapture {
  /**
   * The number of additional image quality retries that should return an error if an image quality validation is detected.
   * This means that if image quality validations are detected, the user will only see an error on the first [1 + max_total_retries] upload attempt.
   * From the [1 + max_total_retries + 1] attempt, if image quality validations are detected, the user will see a warning and they use can choose to
   * proceed regardless of the image quality warning.
   */
  max_total_retries: number
  torch_turn_on_timeMs?: number
  video_length_ms?: number
  video_bitrate?: number
}

export interface ExperimentalFeatures {
  enable_image_quality_service?: boolean
  enable_multi_frame_capture?: boolean
  motion_experiment?: {
    enabled: boolean
  }
}

export interface SdkFeatures {
  enable_require_applicant_consents?: boolean
}

export interface OnDeviceValidation {
  max_total_retries?: number
  threshold?: number
  applies_to?: ApplyFilter[]
}

export interface SdkConfigurationValidations {
  on_device?: SdkConfigurationValidationsOnDevice
}

export interface SdkConfigurationValidationsOnDevice {
  blur?: OnDeviceValidation
}

export type SdkConfiguration = {
  validations?: SdkConfigurationValidations
  experimental_features?: ExperimentalFeatures
  document_capture: DocumentCapture
  biometrics_liveness?: BiometricsLiveness
  sdk_features?: SdkFeatures
}
