import { compose } from 'redux'
import '@types/dom-mediacapture-record'
import type { SdkHandle, SdkOptions, SdkInitMethod } from '~types/sdk'

declare global {
  type Optional<T> = T | null | undefined

  interface PassiveSignalsTracker {
    track: (context?: Record<string, unknown>) => void
    tearDown: () => void
  }

  interface PassiveSignalsTrackerConstructor {
    new (configuration: { jwt: string }): PassiveSignalsTracker
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
    PassiveSignalTracker: PassiveSignalsTrackerConstructor
  }

  interface Navigator extends Window.Navigator {
    msSaveOrOpenBlob?: (blob: Blob, defaultName: string) => void
    msMaxTouchPoints?: number
  }
}
