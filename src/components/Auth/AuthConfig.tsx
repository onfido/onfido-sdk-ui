import { loader } from './assets/loader'
import { success } from './assets/success'
import { borderRadius, color } from '@onfido/castor'
import { FaceTecCustomization } from '~auth-sdk/FaceTecSDK.js/FaceTecCustomization'
import { FaceTecSDK } from '~auth-sdk/FaceTecSDK.js/FaceTecSDK'
import { UICustomizationOptions } from '../../types/ui-customisation-options'

export const Config = (function () {
  const BaseURL = process.env.AUTH_URL

  function getAuthCustomization(
    dimMode: boolean,
    customUi?: UICustomizationOptions
  ) {
    const uiDefaults = {
      /* acccentColor, dualSpinnerColor, and retryScreenOvalColor
      should comply to the brand colors */
      authAccentColor: color('primary-500'),
      authDualSpinnerColor: color('primary-500'),
      authRetryScreenOvalColor: color('primary-500'),

      authOvalColor: '#FFFFFF',
      authTextColor: dimMode ? color('neutral-200') : color('content-main'),
      authButtonCornerRadius: borderRadius('medium'),
      //Dimming mode overrides the frameColor to #000000
      authFrameColor: '#FFFFFF',
      //Button colors for night/dim mode + day
      authButtonTextHighlightColor: dimMode
        ? color('primary-500')
        : color('content-on-action'),
      authButtonTextDisabledColor: dimMode
        ? color('neutral-600')
        : color('content-disabled'),
      authButtonTextNormalColor: dimMode
        ? color('primary-500')
        : color('content-on-action'),
      authButtonColorNormal: dimMode
        ? color('neutral-200')
        : color('background-action'),
      authButtonColorDisabled: dimMode
        ? color('neutral-700')
        : color('background-disabled'),
      authButtonColorPressed: dimMode
        ? color('primary-200')
        : color('background-action-active'),
      authFeedbackBarColor: dimMode
        ? color('neutral-900')
        : color('background-overlay'),
      authFeedbackBarTextColor: color('neutral-white'),
    }
    const uiDef = { ...uiDefaults, ...customUi }
    // Set a default customization
    const defaultCustomization: FaceTecCustomization = new FaceTecSDK.FaceTecCustomization()
    defaultCustomization.vocalGuidanceCustomization.mode = 2
    // Set Cancel Customization
    defaultCustomization.cancelButtonCustomization.location =
      FaceTecSDK.FaceTecCancelButtonLocation.Custom
    defaultCustomization.cancelButtonCustomization.setCustomLocation(
      16,
      16,
      dimMode ? 12 : 15,
      dimMode ? 20 : 15
    )

    defaultCustomization.cancelButtonCustomization.customImage = dimMode
      ? '../../../core-sdk/FaceTec_images/FaceTec_cancel_alt.png'
      : '../../../core-sdk/FaceTec_images/FaceTec_cancel.png'

    // Set Frame Customization
    defaultCustomization.frameCustomization.backgroundColor =
      uiDef.authFrameColor
    defaultCustomization.frameCustomization.borderColor = uiDef.authFrameColor

    // Set Overlay Customization
    defaultCustomization.overlayCustomization.showBrandingImage = false
    defaultCustomization.overlayCustomization.backgroundColor =
      uiDef.authFrameColor

    // Set Guidance Customization
    defaultCustomization.guidanceCustomization.backgroundColors =
      uiDef.authFrameColor
    defaultCustomization.guidanceCustomization.foregroundColor =
      uiDef.authTextColor
    defaultCustomization.guidanceCustomization.buttonBackgroundNormalColor =
      uiDef.authButtonColorNormal
    defaultCustomization.guidanceCustomization.buttonBackgroundDisabledColor =
      uiDef.authButtonColorDisabled
    defaultCustomization.guidanceCustomization.buttonBackgroundHighlightColor =
      uiDef.authButtonColorPressed
    defaultCustomization.guidanceCustomization.buttonTextNormalColor =
      uiDef.authButtonTextNormalColor
    defaultCustomization.guidanceCustomization.buttonTextDisabledColor =
      uiDef.authButtonTextDisabledColor
    defaultCustomization.guidanceCustomization.buttonTextHighlightColor =
      uiDef.authButtonTextHighlightColor
    defaultCustomization.guidanceCustomization.buttonRelativeWidth = '1f'
    defaultCustomization.guidanceCustomization.buttonCornerRadius =
      uiDef.authButtonCornerRadius
    defaultCustomization.guidanceCustomization.retryScreenImageBorderColor = color(
      'neutral-white'
    )
    defaultCustomization.guidanceCustomization.retryScreenImageBorderWidth =
      '2px'
    defaultCustomization.guidanceCustomization.retryScreenImageCornerRadius =
      '0'
    defaultCustomization.guidanceCustomization.retryScreenOvalStrokeColor =
      uiDef.authRetryScreenOvalColor
    // defaultCustomization.guidanceCustomization.retryScreenSlideshowImages = retryScreenSlideshowImages
    defaultCustomization.guidanceCustomization.retryScreenSlideshowInterval =
      '1500'
    defaultCustomization.guidanceCustomization.enableRetryScreenSlideshowShuffle = true
    defaultCustomization.guidanceCustomization.enableRetryScreenBulletedInstructions = true

    // Set Oval Customization
    defaultCustomization.ovalCustomization.strokeColor = uiDef.authOvalColor
    defaultCustomization.ovalCustomization.progressColor1 =
      uiDef.authDualSpinnerColor
    defaultCustomization.ovalCustomization.progressColor2 =
      uiDef.authDualSpinnerColor

    // Set Feedback Customization
    defaultCustomization.feedbackCustomization.backgroundColor =
      uiDef.authFeedbackBarColor
    defaultCustomization.feedbackCustomization.textColor =
      uiDef.authFeedbackBarTextColor
    defaultCustomization.feedbackCustomization.cornerRadius =
      uiDef.authButtonCornerRadius
    defaultCustomization.feedbackCustomization.relativeWidth = '1f'

    // Set Result Screen Customization
    defaultCustomization.resultScreenCustomization.backgroundColors =
      uiDef.authFrameColor
    defaultCustomization.resultScreenCustomization.foregroundColor =
      uiDef.authTextColor
    defaultCustomization.resultScreenCustomization.activityIndicatorColor =
      uiDef.authAccentColor
    defaultCustomization.resultScreenCustomization.resultAnimationBackgroundColor =
      uiDef.authAccentColor
    defaultCustomization.resultScreenCustomization.resultAnimationForegroundColor =
      uiDef.authFrameColor
    defaultCustomization.resultScreenCustomization.uploadProgressFillColor =
      uiDef.authAccentColor

    // Set Animated Customization
    const loaderSVG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    )
    loaderSVG.setAttribute('viewBox', '0 0 56 56')
    loaderSVG.classList.add('experiment-svg')
    loaderSVG.innerHTML = loader
    defaultCustomization.initialLoadingAnimationCustomization.backgroundColor =
      uiDef.authFrameColor
    defaultCustomization.initialLoadingAnimationCustomization.foregroundColor =
      uiDef.authTextColor
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
