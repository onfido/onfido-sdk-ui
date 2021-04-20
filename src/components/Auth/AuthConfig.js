import { loader } from './assets/loader'
import { success } from './assets/success'
import { color } from '@onfido/castor'
import { FaceTecSDK } from '../../../core-sdk/FaceTecSDK.js/FaceTecSDK'
// import { FaceTecVocalGuidanceMode } from '../../../core-sdk/FaceTecSDK.js/FaceTecPublicApi'

export const Config = (function () {
  const BaseURL = process.env.OLD_AUTH

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

    defaultCustomization.vocalGuidanceCustomization.mode = 2
    // Set Cancel Customization
    defaultCustomization.cancelButtonCustomization.customLocation = {
      x: 16,
      y: 16,
      width: 15,
      height: 15,
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
    BaseURL,
    getAuthCustomization,
  }
})()
