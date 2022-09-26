import { EventEmitter2 } from 'eventemitter2'
import { FaceTecSDK } from '~auth-sdk/FaceTecSDK.js/FaceTecSDK'
import type {
  FaceTecSessionResult,
  FaceTecFaceScanResultCallback,
  FaceTecFaceScanProcessor,
} from '~auth-sdk/FaceTecSDK.js/FaceTecPublicApi'

type AuthConfigType = {
  token: string
  production_key_text: string
  device_key_identifier: string
  public_key: string
}

export class AuthCheckProcessor implements FaceTecFaceScanProcessor {
  latestNetworkRequest = new XMLHttpRequest()
  success
  apiUrl
  sdkToken
  nextStep
  goBack
  events
  authConfig
  retryCount
  maxRetries

  constructor(
    apiUrl: string | undefined,
    authConfig: AuthConfigType,
    maxRetries: number,
    sdkToken: string,
    nextStep: () => void,
    goBack: () => void,
    events?: EventEmitter2.emitter
  ) {
    this.sdkToken = sdkToken
    this.apiUrl = apiUrl
    this.success = false
    this.nextStep = nextStep
    this.goBack = goBack
    this.events = events

    this.authConfig = authConfig
    this.retryCount = 0
    this.maxRetries = maxRetries
    //
    // Part 1:  Starting the FaceTec Session
    //
    new FaceTecSDK.FaceTecSession(this, authConfig.token)
  }

  //
  // Part 2:  Handling the Result of a FaceScan
  //
  processSessionResultWhileFaceTecSDKWaits = (
    sessionResult: FaceTecSessionResult,
    faceScanResultCallback: FaceTecFaceScanResultCallback
  ): void => {
    //
    // Part 3:  Handles early exit scenarios where there is no FaceScan to handle -- i.e. User Cancellation, Timeouts, etc.
    //
    if (
      sessionResult.status !==
      FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully
    ) {
      console.info(
        `Session was not completed successfully, cancelling.  Status: ${sessionResult.status}`
      )
      this.latestNetworkRequest.abort()
      faceScanResultCallback.cancel()
      return
    }
    //
    // Part 4:  Get essential data off the FaceTecSessionResult
    //
    const parameters = {
      face_scan: sessionResult.faceScan,
      audit_trail_image: sessionResult.auditTrail[0],
      low_quality_audit_trail_image: sessionResult.lowQualityAuditTrail[0],
      metadata: {
        sdk_source: process.env.SDK_SOURCE,
        sdk_version: process.env.SDK_VERSION,
        sdk_metadata: {
          system: {
            fingerprint: '',
            model: '',
            manufacturer: '',
            brand: '',
            product: '',
            hardware: '',
          },
        },
      },
    }

    //
    // Part 5:  Make the Networking Call to the Onfido Servers.
    //
    this.latestNetworkRequest = new XMLHttpRequest()
    this.latestNetworkRequest.open('POST', `${this.apiUrl}/v3/auth_3d`)
    this.latestNetworkRequest.setRequestHeader(
      'Authorization',
      `Bearer ${this.sdkToken}`
    )
    this.latestNetworkRequest.setRequestHeader(
      'Content-Type',
      'application/json'
    )

    this.latestNetworkRequest.onreadystatechange = () => {
      //
      // Part 6:  We evaluate a boolean response and treat true as success, false as "User Needs to Retry".

      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        const responseJSON = JSON.parse(this.latestNetworkRequest.responseText)
        try {
          const responseObj = responseJSON

          if (responseObj.success === true) {
            this.success = true

            faceScanResultCallback.succeed()
          } else if (responseObj.success === false) {
            this.success = false
            this.retryCount = this.retryCount + 1

            console.warn('User needs to retry, invoking retry.')
            if (this.retryCount < this.maxRetries) {
              faceScanResultCallback.retry()
            } else faceScanResultCallback.cancel()
          } else {
            this.success = false

            console.error('Unexpected API response, cancelling out.')
            faceScanResultCallback.cancel()
          }

          this.nextStep()
          this.events?.emit('complete', {
            type: 'complete',
            ...responseObj,
          })
        } catch {
          this.success = false
          const message =
            'Exception while handling API response, cancelling out.'
          this.events?.emit('error', { type: 'exception', message })
          faceScanResultCallback.cancel()
          this.nextStep()
        }
      }
    }

    this.latestNetworkRequest.onerror = () => {
      const message = 'XHR error, cancelling.'
      this.events?.emit('error', { type: 'exception', message })
      console.error(message)
      faceScanResultCallback.cancel()
    }

    //
    // Part 7:  Demonstrates updating the Progress Bar based on the progress event.
    //
    this.latestNetworkRequest.upload.onprogress = function name(event) {
      const progress = event.loaded / event.total
      faceScanResultCallback.uploadProgress(progress)
    }

    //
    // Part 8:  Actually send the request.
    //
    const jsonStringToUpload = JSON.stringify(parameters)
    this.latestNetworkRequest.send(jsonStringToUpload)
  }

  //
  // Part 10:  This function gets called after the FaceTec SDK is completely done.
  //
  onFaceTecSDKCompletelyDone = (): void => {
    // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after logic signals the FaceTec SDK with a success() or cancel().
    // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
    if (!this.success) this.goBack()
    console.info(
      'FaceTecSDK session has finished. Session results are unknown.'
    )
  }
}
