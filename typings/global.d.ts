import { OnfidoSdk, SdkHandle, SdkOptions } from '~types/sdk'

declare global {
  namespace NodeJS {
    interface Global {
      Onfido: OnfidoSdk
    }
  }

  interface Window {
    Onfido: OnfidoSdk
    onfidoSdkHandle: SdkHandle
    updateOptions: (
      options: SdkOptions & { onComplete?: (data: unknown) => void }
    ) => void
  }
}
