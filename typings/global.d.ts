import { SdkHandle, SdkOptions } from '~types/sdk'
import { init as initFunction } from '~types/index'

type OnfidoSdk = { init: typeof initFunction }

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
