//
// Welcome to the annotated FaceTec Device SDK core code for performing secure Liveness Checks!
//

import { Config } from './AuthConfig'
import { FaceTecSDK } from '../../../core-sdk/FaceTecSDK.js/FaceTecSDK'

export class AuthCheckProcessor {
  latestNetworkRequest = new XMLHttpRequest()
  success
  sdkToken
  nextStep
  events

  constructor(
    sessionToken: string,
    sdkToken: string,
    nextStep: () => void,
    //@ts-ignore
    events
  ) {
    this.sdkToken = sdkToken
    this.success = false
    this.nextStep = nextStep
    this.events = events

    //
    // Part 1:  Starting the FaceTec Session
    //
    const facetecsession = new FaceTecSDK.FaceTecSession(this, sessionToken)
  }

  //
  // Part 2:  Handling the Result of a FaceScan
  //
  processSessionResultWhileFaceTecSDKWaits(
    sessionResult,
    faceScanResultCallback
  ) {
    //
    // Part 3:  Handles early exit scenarios where there is no FaceScan to handle -- i.e. User Cancellation, Timeouts, etc.
    //
    if (
      sessionResult.status !==
      FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully
    ) {
      console.log(
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
        sdk_source: 'onfido_web_sdk',
        sdk_version: '1.0',
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
    // Part 5:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
    //
    this.latestNetworkRequest = new XMLHttpRequest()
    this.latestNetworkRequest.open('POST', `${Config.BaseURL}/auth_3d`)
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
      // Part 6:  In our Sample, we evaluate a boolean response and treat true as success, false as "User Needs to Retry",
      // and handle all other non-nominal responses by cancelling out.  You may have different paradigms in your own API and are free to customize based on these.
      //

      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        const responseJSON = JSON.parse(this.latestNetworkRequest.responseText)
        try {
          const responseObj = responseJSON

          if (responseObj.success === true) {
            this.success = true

            faceScanResultCallback.succeed()
            this.nextStep()
          } else if (responseObj.success === false) {
            this.success = false

            console.log('User needs to retry, invoking retry.')
            faceScanResultCallback.retry()
          } else {
            this.success = null

            console.log('Unexpected API response, cancelling out.')
            faceScanResultCallback.cancel()
            this.nextStep()
          }

          this.events?.emit('complete', {
            type: 'complete',
            ...responseObj,
          })
        } catch {
          // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
          this.success = null
          const message =
            'Exception while handling API response, cancelling out.'
          this.events?.emit('error', { type: 'exception', message })
          faceScanResultCallback.cancel()
          this.nextStep()
        }
      }
    }

    this.latestNetworkRequest.onerror = () => {
      // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
      const message = 'XHR error, cancelling.'
      this.events?.emit('error', { type: 'exception', message })
      console.log(message)
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

    //
    // Part 9:  For better UX, update the User if the upload is taking a while.  You are free to customize and enhance this behavior to your liking.
    //
    setTimeout(() => {
      if (this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        return
      }
      faceScanResultCallback.uploadMessageOverride('Still Uploading...')
    }, 6000)
  }

  //
  // Part 10:  This function gets called after the FaceTec SDK is completely done.  There are no parameters because you have already been passed all data in the processSessionWhileFaceTecSDKWaits function and have already handled all of your own results.
  //
  onFaceTecSDKCompletelyDone = () => {
    //
    // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after you signal the FaceTec SDK with success() or cancel().
    // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
    //
    // this.sampleAppControllerReference.onComplete()
    console.log('complete!')
  }

  //
  // DEVELOPER NOTE:  This public convenience method is for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In your code, you may not even want or need to do this.
  //
}
