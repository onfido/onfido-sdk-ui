import { SdkHandle, SdkOptions, SdkInitMethod } from '~types/sdk'

declare global {
  namespace NodeJS {
    interface Global {
      Onfido: {
        init: SdkInitMethod
      }
    }
  }

  interface Window extends NodeJS.Global {
    __REDUX_DEVTOOLS_EXTENSION__?: () => unknown
    onfidoSdkHandle: SdkHandle
    updateOptions: (
      options: SdkOptions & { onComplete?: (data: unknown) => void }
    ) => void
  }
}
