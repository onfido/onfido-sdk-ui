import { SdkConfiguration } from './types'

export const defaultConfiguration: SdkConfiguration = {
  experimental_features: {
    enable_multi_frame_capture: false,
    motion_experiment: {
      enabled: false,
    },
  },
  sdk_features: {
    enable_require_applicant_consents: true,
    disable_cross_device_sms: false,
    enable_logger: {
      enabled: false,
    },
  },
  document_capture: {
    max_total_retries: 1,
  },
}
