import { LogLevels } from '~core/Logger'

interface ApplyFilter {
  doc_type?: string
}

interface BiometricsLiveness {
  active?: BiometricsLivenessActive
  passive?: BiometricsLivenessPassive
}

interface BiometricsLivenessActive {
  enabled?: boolean
  video_settings?: BiometricsLivenessActiveVideoSettings
}

interface BiometricsLivenessActiveVideoSettings {
  framerate?: number
  bitrate?: number
  duration?: number
  focusLock?: boolean
  white_balanceLock?: boolean
  exposure_lock?: boolean
  codec?: string
  codec_profile?: number
}

interface BiometricsLivenessPassive {
  enabled?: boolean
  video_settings?: BiometricsLivenessPassiveVideoSettings
}

interface BiometricsLivenessPassiveVideoSettings {
  framerate?: number
  bitrate?: number
  duration?: number
  focus_lock?: boolean
  white_balance_lock?: boolean
  exposure_lock?: boolean
  codec?: string
}

interface DocumentCapture {
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

interface ExperimentalFeatures {
  enable_image_quality_service?: boolean
  enable_multi_frame_capture?: boolean
  motion_experiment?: {
    enabled: boolean
  }
}

interface SdkFeatures {
  enable_require_applicant_consents?: boolean
  disable_cross_device_sms?: boolean
  enable_logger?: {
    enabled?: boolean
    levels?: LogLevels[]
  }
}

interface OnDeviceValidation {
  max_total_retries?: number
  threshold?: number
  applies_to?: ApplyFilter[]
}

interface SdkConfigurationValidations {
  on_device?: SdkConfigurationValidationsOnDevice
}

interface SdkConfigurationValidationsOnDevice {
  blur?: OnDeviceValidation
}

export type SdkConfiguration = {
  validations?: SdkConfigurationValidations
  experimental_features?: ExperimentalFeatures
  document_capture: DocumentCapture
  biometrics_liveness?: BiometricsLiveness
  sdk_features?: SdkFeatures
}
