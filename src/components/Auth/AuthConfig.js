import { loader } from './assets/loader'
import { success } from './assets/success'
import { color } from '@onfido/castor'
import { FaceTecSDK } from '../../../core-sdk/FaceTecSDK.js/FaceTecSDK'
// import { FaceTecCancelButtonLocation } from '../../../core-sdk/FaceTecSDK.js/FaceTecCustomization'

export const Config = (function () {
  // -------------------------------------
  // REQUIRED
  // Available at https://dev.facetec.com/#/account
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const device_key_identifier = 'dI6BscHk3fuQIIHWuZdKKq6V233LqiAs'

  // -------------------------------------
  // REQUIRED
  // The URL to call to process FaceTec SDK Sessions.
  // In Production, you likely will handle network requests elsewhere and without the use of this variable.
  // See https://dev.facetec.com/#/security-best-practices?link=zoom-server-rest-endpoint-security for more information.
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const BaseURL = process.env.OLD_AUTH

  // -------------------------------------
  // REQUIRED
  // The FaceMap Encryption Key you define for your application.
  // Please see https://dev.facetec.com/#/licensing-and-encryption-keys for more information.
  // NOTE: This field is auto-populated by the FaceTec SDK Configuration Wizard.
  const public_key =
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5PxZ3DLj+zP6T6HFgzzk\n' +
    'M77LdzP3fojBoLasw7EfzvLMnJNUlyRb5m8e5QyyJxI+wRjsALHvFgLzGwxM8ehz\n' +
    'DqqBZed+f4w33GgQXFZOS4AOvyPbALgCYoLehigLAbbCNTkeY5RDcmmSI/sbp+s6\n' +
    'mAiAKKvCdIqe17bltZ/rfEoL3gPKEfLXeN549LTj3XBp0hvG4loQ6eC1E1tRzSkf\n' +
    'GJD4GIVvR+j12gXAaftj3ahfYxioBH7F7HQxzmWkwDyn3bqU54eaiB7f0ftsPpWM\n' +
    'ceUaqkL2DZUvgN0efEJjnWy5y1/Gkq5GGWCROI9XG/SwXJ30BbVUehTbVcD70+ZF\n' +
    '8QIDAQAB\n' +
    '-----END PUBLIC KEY-----'

  const production_key_text = process.env.AUTH_PUBLIC_TEXT

  function getAuthCustomization(FaceTecSDK, dimMode) {
    const accentColor = color('primary-500')
    const frameColor = dimMode ? '#000000' : '#fcfcfd'
    const ovalColor = color(dimMode ? 'neutral-black' : 'neutral-white')
    const retryScreenOvalColor = color('primary-500')
    const dualSpinnerColor = color('primary-500')
    const textColor = dimMode
      ? color('content-inverse-main')
      : color('content-main')
    const buttonCornerRadius = '4px'
    const buttonTextColor = color(
      dimMode ? 'content-main' : 'content-inverse-main'
    )
    const buttonColorNormal = color('primary-500')
    const buttonColorDisabled = color('background-disabled')
    const buttonColorPressed = color('primary-400')
    const feedbackBarColor = '#000000CC'
    const feedbackBarTextColor = color(
      dimMode ? 'content-main' : 'content-inverse-main'
    )

    // Set a default customization
    const defaultCustomization = new FaceTecSDK.FaceTecCustomization()

    // Set Cancel Customization
    defaultCustomization.cancelButtonCustomization.customLocation = {
      x: 16,
      y: 16,
      width: 32,
      height: 32,
    }
    defaultCustomization.cancelButtonCustomization.location =
      FaceTecSDK.FaceTecCancelButtonLocation.Custom

    // Set Frame Customization
    defaultCustomization.frameCustomization.backgroundColor = frameColor
    defaultCustomization.frameCustomization.borderColor = frameColor

    // Set Overlay Customization
    defaultCustomization.overlayCustomization.showBrandingImage = false
    defaultCustomization.overlayCustomization.backgroundColor = frameColor

    // Set Guidance Customization
    defaultCustomization.guidanceCustomization.backgroundColors = dimMode
      ? '#000000'
      : '#FCFCFD'
    defaultCustomization.guidanceCustomization.foregroundColor = textColor
    defaultCustomization.guidanceCustomization.buttonBackgroundNormalColor = buttonColorNormal
    defaultCustomization.guidanceCustomization.buttonBackgroundDisabledColor = buttonColorDisabled
    defaultCustomization.guidanceCustomization.buttonBackgroundHighlightColor = buttonColorPressed
    defaultCustomization.guidanceCustomization.buttonTextNormalColor = buttonTextColor
    defaultCustomization.guidanceCustomization.buttonTextDisabledColor = buttonTextColor
    defaultCustomization.guidanceCustomization.buttonTextHighlightColor = buttonTextColor
    defaultCustomization.guidanceCustomization.buttonRelativeWidth = '1f'
    defaultCustomization.guidanceCustomization.buttonCornerRadius = buttonCornerRadius
    defaultCustomization.guidanceCustomization.retryScreenImageBorderColor = color(
      'neutral-white'
    )
    defaultCustomization.guidanceCustomization.retryScreenImageBorderWidth =
      '2px'
    defaultCustomization.guidanceCustomization.retryScreenImageCornerRadius =
      '0'
    defaultCustomization.guidanceCustomization.retryScreenOvalStrokeColor = retryScreenOvalColor
    // defaultCustomization.guidanceCustomization.retryScreenSlideshowImages = retryScreenSlideshowImages
    defaultCustomization.guidanceCustomization.retryScreenSlideshowInterval =
      '1500'
    defaultCustomization.guidanceCustomization.enableRetryScreenSlideshowShuffle = true
    defaultCustomization.guidanceCustomization.enableRetryScreenBulletedInstructions = true

    // Set Oval Customization
    defaultCustomization.ovalCustomization.strokeColor = ovalColor
    defaultCustomization.ovalCustomization.progressColor1 = dualSpinnerColor
    defaultCustomization.ovalCustomization.progressColor2 = dualSpinnerColor

    // Set Feedback Customization
    defaultCustomization.feedbackCustomization.backgroundColor = feedbackBarColor
    defaultCustomization.feedbackCustomization.textColor = feedbackBarTextColor
    defaultCustomization.feedbackCustomization.cornerRadius = buttonCornerRadius
    defaultCustomization.feedbackCustomization.relativeWidth = '1f'

    // Set Result Screen Customization
    defaultCustomization.resultScreenCustomization.backgroundColors = frameColor
    defaultCustomization.resultScreenCustomization.foregroundColor = textColor
    defaultCustomization.resultScreenCustomization.activityIndicatorColor = accentColor
    defaultCustomization.resultScreenCustomization.resultAnimationBackgroundColor = accentColor
    defaultCustomization.resultScreenCustomization.resultAnimationForegroundColor = frameColor
    defaultCustomization.resultScreenCustomization.uploadProgressFillColor = accentColor

    this.currentCustomization = defaultCustomization

    // Set Animated Customization
    const loaderSVG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    loaderSVG.setAttribute('viewBox', '0 0 56 56')
    loaderSVG.classList.add('experiment-svg')
    loaderSVG.innerHTML = loader
    defaultCustomization.initialLoadingAnimationCustomization.backgroundColor = frameColor
    defaultCustomization.initialLoadingAnimationCustomization.foregroundColor = textColor
    defaultCustomization.initialLoadingAnimationCustomization.customAnimation = loaderSVG

    // Set Success Customization
    const successSVG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    successSVG.setAttribute('viewBox', '0 0 56 56')
    successSVG.innerHTML = success
    defaultCustomization.resultScreenCustomization.customResultAnimationSuccess = successSVG
    defaultCustomization.resultScreenCustomization.customActivityIndicatorAnimation = loaderSVG

    return defaultCustomization
  }
  return {
    device_key_identifier,
    BaseURL,
    public_key,
    production_key_text,
    getAuthCustomization,
  }
})()
