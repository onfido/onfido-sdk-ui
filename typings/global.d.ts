import { compose } from 'redux'
import '@types/dom-mediacapture-record'
import type { SdkHandle, SdkOptions, SdkInitMethod } from '~types/sdk'

declare global {
  type Optional<T> = T | null | undefined

  namespace PassiveSignals {
    type Context = {
      disable_cookies?: boolean
      sdk_version?: string
    }

    type Configuration = {
      jwt: string
      context?: Context
    }

    class Tracker {
      constructor(configuration: Configuration): Tracker
      track: () => void
      stop: () => void
    }
  }

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
    OnfidoPassiveSignals: typeof PassiveSignals.Tracker
  }

  interface Navigator extends Window.Navigator {
    msSaveOrOpenBlob?: (blob: Blob, defaultName: string) => void
    msMaxTouchPoints?: number
  }
}
