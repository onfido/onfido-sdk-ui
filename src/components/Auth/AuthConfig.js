import { loader } from './assets/loader'
import { success } from './assets/success'

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

  function retrieveConfigurationWizardCustomization(FaceTecSDK) {
    const sdkImageDirectory = '../../../core-sdk/FaceTec_images/'

    // For Color Customization
    const outerBackgroundColor = '#ffffff'
    const frameColor = '#ffffff'
    const borderColor = '#ffffff'
    const ovalColor = '#ffffff00'
    const dualSpinnerColor = '#ffffff00'
    const textColor = '#008cff'
    const buttonAndFeedbackBarColor = '#000000CC'
    const buttonAndFeedbackBarTextColor = '#ffffff'
    const buttonColorPressed = '#3640F5'

    // For Frame Corner Radius Customization
    const frameCornerRadius = '20px'

    // For Cancel Button Customization
    const cancelButtonImage = `${sdkImageDirectory}FaceTec_cancel.png`
    const cancelButtonLocation = FaceTecSDK.FaceTecCancelButtonLocation.TopLeft

    // For image Customization
    const yourAppLogoImage = `${sdkImageDirectory}FaceTec_your_app_logo.png`
    const securityWatermarkImage =
      FaceTecSDK.FaceTecSecurityWatermarkImage.FaceTec_ZoOm

    // Set a default customization
    const defaultCustomization = new FaceTecSDK.FaceTecCustomization()

    // Set Frame Customization
    defaultCustomization.frameCustomization.borderCornerRadius = frameCornerRadius
    defaultCustomization.frameCustomization.backgroundColor = frameColor
    defaultCustomization.frameCustomization.borderColor = borderColor

    // Set Overlay Customization
    defaultCustomization.overlayCustomization.brandingImage = yourAppLogoImage
    defaultCustomization.overlayCustomization.backgroundColor = outerBackgroundColor

    // Set Guidance Customization
    defaultCustomization.guidanceCustomization.backgroundColors = frameColor
    defaultCustomization.guidanceCustomization.foregroundColor = textColor
    defaultCustomization.guidanceCustomization.buttonBackgroundNormalColor =
      '#232AAD'
    defaultCustomization.guidanceCustomization.buttonBackgroundDisabledColor =
      '#E9ECF0'
    defaultCustomization.guidanceCustomization.buttonBackgroundHighlightColor =
      '#232AAD'
    defaultCustomization.guidanceCustomization.buttonTextNormalColor = '#F7F9FA'
    defaultCustomization.guidanceCustomization.buttonTextDisabledColor =
      '#828893'
    defaultCustomization.guidanceCustomization.buttonTextHighlightColor =
      '#F7F9FA'
    defaultCustomization.guidanceCustomization.retryScreenImageBorderColor = borderColor
    defaultCustomization.guidanceCustomization.retryScreenOvalStrokeColor = borderColor

    // Set Oval Customization
    defaultCustomization.ovalCustomization.strokeColor = ovalColor
    defaultCustomization.ovalCustomization.progressColor1 = dualSpinnerColor
    defaultCustomization.ovalCustomization.progressColor2 = dualSpinnerColor

    // Set Feedback Customization
    defaultCustomization.feedbackCustomization.backgroundColor = buttonAndFeedbackBarColor
    defaultCustomization.feedbackCustomization.textColor = buttonAndFeedbackBarTextColor

    // Set Cancel Customization
    defaultCustomization.cancelButtonCustomization.customImage = cancelButtonImage
    defaultCustomization.cancelButtonCustomization.location = cancelButtonLocation

    // Set Security Watermark Customization
    defaultCustomization.securityWatermarkCustomization.setSecurityWatermarkImage(
      securityWatermarkImage
    )

    // Set Result Screen Customization
    defaultCustomization.resultScreenCustomization.backgroundColors = frameColor
    defaultCustomization.resultScreenCustomization.foregroundColor = textColor
    defaultCustomization.resultScreenCustomization.activityIndicatorColor = buttonAndFeedbackBarColor
    defaultCustomization.resultScreenCustomization.resultAnimationBackgroundColor = buttonAndFeedbackBarColor
    defaultCustomization.resultScreenCustomization.resultAnimationForegroundColor = buttonAndFeedbackBarTextColor
    defaultCustomization.resultScreenCustomization.uploadProgressFillColor = buttonAndFeedbackBarColor

    this.currentCustomization = defaultCustomization

    // Set ID Scan Customization
    defaultCustomization.idScanCustomization.selectionScreenBackgroundColors = frameColor
    defaultCustomization.idScanCustomization.selectionScreenForegroundColor = textColor
    defaultCustomization.idScanCustomization.reviewScreenBackgroundColors = frameColor
    defaultCustomization.idScanCustomization.reviewScreenForegroundColor = buttonAndFeedbackBarTextColor
    defaultCustomization.idScanCustomization.reviewScreenTextBackgroundColor = buttonAndFeedbackBarColor
    defaultCustomization.idScanCustomization.captureScreenForegroundColor = buttonAndFeedbackBarTextColor
    defaultCustomization.idScanCustomization.captureScreenTextBackgroundColor = buttonAndFeedbackBarColor
    defaultCustomization.idScanCustomization.buttonBackgroundNormalColor = buttonAndFeedbackBarColor
    defaultCustomization.idScanCustomization.buttonBackgroundDisabledColor = buttonColorPressed
    defaultCustomization.idScanCustomization.buttonBackgroundHighlightColor = buttonColorPressed
    defaultCustomization.idScanCustomization.buttonTextNormalColor = buttonAndFeedbackBarTextColor
    defaultCustomization.idScanCustomization.buttonTextDisabledColor = buttonAndFeedbackBarTextColor
    defaultCustomization.idScanCustomization.buttonTextHighlightColor = buttonAndFeedbackBarTextColor
    defaultCustomization.idScanCustomization.captureScreenBackgroundColor = frameColor
    defaultCustomization.idScanCustomization.captureFrameStrokeColor = borderColor

    // Set Initial Loading Customization
    const loaderSVG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    loaderSVG.setAttribute('viewBox', '0 0 56 56')
    loaderSVG.classList.add('experiment-svg')
    loaderSVG.innerHTML = loader
    defaultCustomization.initialLoadingAnimationCustomization.backgroundColor = buttonAndFeedbackBarTextColor
    defaultCustomization.initialLoadingAnimationCustomization.foregroundColor = buttonAndFeedbackBarColor
    defaultCustomization.initialLoadingAnimationCustomization.customAnimation = loaderSVG

    // Set Success Customization
    const successSVG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    successSVG.setAttribute('viewBox', '0 0 56 56')
    successSVG.innerHTML = success
    defaultCustomization.resultScreenCustomization.customResultAnimationSuccess = successSVG

    return defaultCustomization
  }
  return {
    device_key_identifier,
    BaseURL,
    public_key,
    production_key_text,
    retrieveConfigurationWizardCustomization,
  }
})()
