import { loader } from './assets/loader'
import { success } from './assets/success'
import { borderRadius, color } from '@onfido/castor'
import type { ApiRawError, SuccessCallback } from '~types/api'
import { FaceTecCustomization } from '~auth-sdk/FaceTecSDK.js/FaceTecCustomization'
import { FaceTecSDK } from '~auth-sdk/FaceTecSDK.js/FaceTecSDK'
import { UICustomizationOptions } from '~types/ui-customisation-options'

export const getAuthCustomization = (
  dimMode: boolean,
  customUI?: UICustomizationOptions
): FaceTecCustomization => {
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
  const uiCustomization = { ...uiDefaults, ...customUI }
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
    ? `${process.env.PUBLIC_PATH}auth-sdk/FaceTec/FaceTec_images/FaceTec_cancel_alt.png`
    : `${process.env.PUBLIC_PATH}auth-sdk/FaceTec/FaceTec_images/FaceTec_cancel.png`

  // Set Frame Customization
  defaultCustomization.frameCustomization.backgroundColor =
    uiCustomization.authFrameColor
  defaultCustomization.frameCustomization.borderColor =
    uiCustomization.authFrameColor

  // Set Overlay Customization
  defaultCustomization.overlayCustomization.showBrandingImage = false
  defaultCustomization.overlayCustomization.backgroundColor =
    uiCustomization.authFrameColor

  // Set Guidance Customization
  defaultCustomization.guidanceCustomization.backgroundColors =
    uiCustomization.authFrameColor
  defaultCustomization.guidanceCustomization.foregroundColor =
    uiCustomization.authTextColor
  defaultCustomization.guidanceCustomization.buttonBackgroundNormalColor =
    uiCustomization.authButtonColorNormal
  defaultCustomization.guidanceCustomization.buttonBackgroundDisabledColor =
    uiCustomization.authButtonColorDisabled
  defaultCustomization.guidanceCustomization.buttonBackgroundHighlightColor =
    uiCustomization.authButtonColorPressed
  defaultCustomization.guidanceCustomization.buttonTextNormalColor =
    uiCustomization.authButtonTextNormalColor
  defaultCustomization.guidanceCustomization.buttonTextDisabledColor =
    uiCustomization.authButtonTextDisabledColor
  defaultCustomization.guidanceCustomization.buttonTextHighlightColor =
    uiCustomization.authButtonTextHighlightColor
  defaultCustomization.guidanceCustomization.buttonCornerRadius =
    uiCustomization.authButtonCornerRadius
  defaultCustomization.guidanceCustomization.retryScreenImageBorderColor = color(
    'neutral-white'
  )
  defaultCustomization.guidanceCustomization.retryScreenImageBorderWidth = '2px'
  defaultCustomization.guidanceCustomization.retryScreenImageCornerRadius = '0'
  defaultCustomization.guidanceCustomization.retryScreenOvalStrokeColor =
    uiCustomization.authRetryScreenOvalColor
  // defaultCustomization.guidanceCustomization.retryScreenSlideshowImages = retryScreenSlideshowImages
  defaultCustomization.guidanceCustomization.retryScreenSlideshowInterval =
    '1500'
  defaultCustomization.guidanceCustomization.enableRetryScreenSlideshowShuffle = true

  // Set Oval Customization
  defaultCustomization.ovalCustomization.strokeColor =
    uiCustomization.authOvalColor
  defaultCustomization.ovalCustomization.progressColor1 =
    uiCustomization.authDualSpinnerColor
  defaultCustomization.ovalCustomization.progressColor2 =
    uiCustomization.authDualSpinnerColor

  // Set Feedback Customization
  defaultCustomization.feedbackCustomization.backgroundColor =
    uiCustomization.authFeedbackBarColor
  defaultCustomization.feedbackCustomization.textColor =
    uiCustomization.authFeedbackBarTextColor
  defaultCustomization.feedbackCustomization.cornerRadius =
    uiCustomization.authButtonCornerRadius

  // Set Result Screen Customization
  defaultCustomization.resultScreenCustomization.backgroundColors =
    uiCustomization.authFrameColor
  defaultCustomization.resultScreenCustomization.foregroundColor =
    uiCustomization.authTextColor
  defaultCustomization.resultScreenCustomization.activityIndicatorColor =
    uiCustomization.authAccentColor
  defaultCustomization.resultScreenCustomization.resultAnimationBackgroundColor =
    uiCustomization.authAccentColor
  defaultCustomization.resultScreenCustomization.resultAnimationForegroundColor =
    uiCustomization.authFrameColor
  defaultCustomization.resultScreenCustomization.uploadProgressFillColor =
    uiCustomization.authAccentColor

  // Set Animated Customization
  // DEVELOPER NOTE: This is the only method provided by FaceTec to create the SVGElement to be passed down.
  // This implementation is good to go, as long as nothing that the user controls by url or by editing their profile, etc is passed on `loader`/`success`

  const loaderSVG = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )
  loaderSVG.setAttribute('viewBox', '0 0 56 56')
  loaderSVG.classList.add('onfidoLoaderSvg')
  loaderSVG.innerHTML = loader
  defaultCustomization.initialLoadingAnimationCustomization.backgroundColor =
    uiCustomization.authFrameColor
  defaultCustomization.initialLoadingAnimationCustomization.foregroundColor =
    uiCustomization.authTextColor
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

export const getAuthConfig = (
  apiUrl: string | undefined,
  token: string,
  onSuccess: SuccessCallback<string>,
  onError: (error: ApiRawError) => void
): void => {
  const body = {
    sdk_type: process.env.SDK_SOURCE,
  }
  const request = new XMLHttpRequest()

  request.open('POST', `${apiUrl}/v3/auth_3d/session`)

  request.setRequestHeader('Authorization', token)
  request.setRequestHeader('Application-Id', 'com.onfido.onfidoAuth')
  request.setRequestHeader('Content-Type', 'application/json')

  request.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE) {
      onSuccess(this.responseText)
    } else onError(request)
  }
  request.send(JSON.stringify(body))
}
