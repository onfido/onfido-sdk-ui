import { loader } from './assets/loader'
import { success } from './assets/success'
import { borderRadius, color } from '@onfido/castor'

export const Config = (function () {
  const BaseURL = process.env.OLD_AUTH

  function getAuthCustomization(FaceTecSDK, dimMode, customUi) {
    const uiDef = {
      /* acccentColor, dualSpinnerColor, and retryScreenOvalColor
      should comply to the brand colors */
      accentColor: color('primary-500'),
      dualSpinnerColor: color('primary-500'),
      retryScreenOvalColor: color('primary-500'),

      ovalColor: color('background-always-transparent'),
      textColor: dimMode ? color('neutral-200') : color('content-main'),
      buttonCornerRadius: borderRadius('medium'),
      //Dimming mode overrides the frameColor to #000000
      frameColor: color('background-surface'),
      //Button colors for night/dim mode + day
      buttonTextHighlightColor: dimMode
        ? color('primary-500')
        : color('content-on-action'),
      buttonTextDisabledColor: dimMode
        ? color('neutral-600')
        : color('content-disabled'),
      buttonTextNormalColor: dimMode
        ? color('primary-500')
        : color('content-on-action'),
      buttonColorNormal: dimMode
        ? color('neutral-200')
        : color('background-action'),
      buttonColorDisabled: dimMode
        ? color('neutral-700')
        : color('background-disabled'),
      buttonColorPressed: dimMode
        ? color('primary-200')
        : color('background-action-active'),
      feedbackBarColor: dimMode
        ? color('neutral-900')
        : color('background-overlay'),
      feedbackBarTextColor: color('neutral-white'),
    }
    const customUiKeys = Object.keys(customUi)
    if (customUiKeys.length > 0) {
      customUiKeys.forEach((e) => {
        if (Object.keys(uiDef).includes(e)) uiDef[e] = customUi[e]
      })
    }

    // Set a default customization
    const defaultCustomization = new FaceTecSDK.FaceTecCustomization()

    defaultCustomization.vocalGuidanceCustomization.mode = 2
    // Set Cancel Customization
    defaultCustomization.cancelButtonCustomization.customLocation = {
      x: 16,
      y: 16,
      width: dimMode ? 12 : 15,
      height: dimMode ? 20 : 15,
    }
    defaultCustomization.cancelButtonCustomization.location =
      FaceTecSDK.FaceTecCancelButtonLocation.Custom
    defaultCustomization.cancelButtonCustomization.customImage = dimMode
      ? '../../../../core-sdk/FaceTec_images/FaceTec_cancel_alt.png'
      : '../../../../core-sdk/FaceTec_images/FaceTec_cancel.png'

    // Set Frame Customization
    defaultCustomization.frameCustomization.backgroundColor = uiDef.frameColor
    defaultCustomization.frameCustomization.borderColor = uiDef.frameColor

    // Set Overlay Customization
    defaultCustomization.overlayCustomization.showBrandingImage = false
    defaultCustomization.overlayCustomization.backgroundColor = uiDef.frameColor

    // Set Guidance Customization
    defaultCustomization.guidanceCustomization.backgroundColors =
      uiDef.frameColor
    defaultCustomization.guidanceCustomization.foregroundColor = uiDef.textColor
    defaultCustomization.guidanceCustomization.buttonBackgroundNormalColor =
      uiDef.buttonColorNormal
    defaultCustomization.guidanceCustomization.buttonBackgroundDisabledColor =
      uiDef.buttonColorDisabled
    defaultCustomization.guidanceCustomization.buttonBackgroundHighlightColor =
      uiDef.buttonColorPressed
    defaultCustomization.guidanceCustomization.buttonTextNormalColor =
      uiDef.buttonTextColor
    defaultCustomization.guidanceCustomization.buttonTextDisabledColor =
      uiDef.buttonTextColor
    defaultCustomization.guidanceCustomization.buttonTextHighlightColor =
      uiDef.buttonTextColor
    defaultCustomization.guidanceCustomization.buttonRelativeWidth = '1f'
    defaultCustomization.guidanceCustomization.buttonCornerRadius =
      uiDef.buttonCornerRadius
    defaultCustomization.guidanceCustomization.retryScreenImageBorderColor = color(
      'neutral-white'
    )
    defaultCustomization.guidanceCustomization.retryScreenImageBorderWidth =
      '2px'
    defaultCustomization.guidanceCustomization.retryScreenImageCornerRadius =
      '0'
    defaultCustomization.guidanceCustomization.retryScreenOvalStrokeColor =
      uiDef.retryScreenOvalColor
    // defaultCustomization.guidanceCustomization.retryScreenSlideshowImages = retryScreenSlideshowImages
    defaultCustomization.guidanceCustomization.retryScreenSlideshowInterval =
      '1500'
    defaultCustomization.guidanceCustomization.enableRetryScreenSlideshowShuffle = true
    defaultCustomization.guidanceCustomization.enableRetryScreenBulletedInstructions = true

    // Set Oval Customization
    defaultCustomization.ovalCustomization.strokeColor = uiDef.ovalColor
    defaultCustomization.ovalCustomization.progressColor1 =
      uiDef.dualSpinnerColor
    defaultCustomization.ovalCustomization.progressColor2 =
      uiDef.dualSpinnerColor

    // Set Feedback Customization
    defaultCustomization.feedbackCustomization.backgroundColor =
      uiDef.feedbackBarColor
    defaultCustomization.feedbackCustomization.textColor =
      uiDef.feedbackBarTextColor
    defaultCustomization.feedbackCustomization.cornerRadius =
      uiDef.buttonCornerRadius
    defaultCustomization.feedbackCustomization.relativeWidth = '1f'

    // Set Result Screen Customization
    defaultCustomization.resultScreenCustomization.backgroundColors =
      uiDef.frameColor
    defaultCustomization.resultScreenCustomization.foregroundColor =
      uiDef.textColor
    defaultCustomization.resultScreenCustomization.activityIndicatorColor =
      uiDef.accentColor
    defaultCustomization.resultScreenCustomization.resultAnimationBackgroundColor =
      uiDef.accentColor
    defaultCustomization.resultScreenCustomization.resultAnimationForegroundColor =
      uiDef.frameColor
    defaultCustomization.resultScreenCustomization.uploadProgressFillColor =
      uiDef.accentColor

    this.currentCustomization = defaultCustomization

    // Set Animated Customization
    const loaderSVG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    loaderSVG.setAttribute('viewBox', '0 0 56 56')
    loaderSVG.classList.add('experiment-svg')
    loaderSVG.innerHTML = loader
    defaultCustomization.initialLoadingAnimationCustomization.backgroundColor =
      uiDef.frameColor
    defaultCustomization.initialLoadingAnimationCustomization.foregroundColor =
      uiDef.textColor
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
