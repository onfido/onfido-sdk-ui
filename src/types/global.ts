import { OnfidoSdk, SdkHandle, SdkOptions } from './sdk'

export type ExtendedWindow = {
  Onfido: OnfidoSdk
  onfidoSdkHandle: SdkHandle
  updateOptions: (
    options: SdkOptions & { onComplete?: (data: unknown) => void }
  ) => void
} & typeof window
