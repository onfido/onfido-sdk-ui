import { SdkHandle, SdkOptions } from './sdk'

export interface OnfidoSdk {
  init: (options: SdkOptions) => SdkHandle
}
