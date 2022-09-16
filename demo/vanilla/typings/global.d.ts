import { SdkHandle } from 'onfido-sdk-ui'

declare global {
  interface Window extends WindowOrWorkerGlobalScope {
    onfidoOut?: SdkHandle
  }
}
