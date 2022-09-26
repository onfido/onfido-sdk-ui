import { compose } from 'redux'
import '@types/dom-mediacapture-record'
import type { SdkHandle, SdkOptions, SdkInitMethod } from '~types/sdk'

declare global {
  type Optional<T> = T | null | undefined

  namespace NodeJS {
    interface Global {
      OnfidoAuth: {
        init: SdkInitMethod
      }
      Onfido: {
        init: SdkInitMethod
      }
    }
  }

  interface Window extends NodeJS.Global {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof compose
    onfidoSdkHandle: SdkHandle
    updateOptions?: (
      options: SdkOptions & { onComplete?: (data: unknown) => void }
    ) => void
    MSStream: object
  }

  interface Navigator extends Window.Navigator {
    msSaveOrOpenBlob?: (blob: Blob, defaultName: string) => void
    msMaxTouchPoints?: number
  }
}
