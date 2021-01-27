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
    onfidoSdkHandle: SdkHandle
    updateOptions: (
      options: SdkOptions & { onComplete?: (data: unknown) => void }
    ) => void
  }

  module '*.scss' {
    const content: { [className: string]: string }
    export = content
  }
}
