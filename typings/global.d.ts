import { OnfidoSdk, SdkHandle, SdkOptions } from '~types/sdk'

declare global {
  interface Window {
    Onfido: OnfidoSdk
    onfidoSdkHandle: SdkHandle
    updateOptions: (
      options: SdkOptions & { onComplete?: (data: unknown) => void }
    ) => void
  }
}
