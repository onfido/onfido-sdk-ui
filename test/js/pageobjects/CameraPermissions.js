import Base from './BasePage.js'
import {locale, verifyElementCopy} from '../utils/mochaw'

class CameraPermissions extends Base {
  get title() { return this.$('.onfido-sdk-ui-PageTitle-titleSpan')}
  get subtitle() { return this.$('.onfido-sdk-ui-PageTitle-subTitle')}
  get instructions() { return this.$('.onfido-sdk-ui-CameraPermissions-Primer-instructions')}
  get graphic() { return this.$('.onfido-sdk-ui-CameraPermissions-Primer-graphic')}
  get allow() { return this.$('.onfido-sdk-ui-CameraPermissions-Primer-allow')}
  get enableCameraButton() { return this.$('.onfido-sdk-ui-Button-button-text')}

  copy(lang) { return locale(lang) }

  async verifyUIElementsOnTheCameraPermissionsScreen(copy) {
    const cameraPermissionsStrings = copy.webcam_permissions
    verifyElementCopy(this.title, cameraPermissionsStrings.allow_access)
    verifyElementCopy(this.subtitle, cameraPermissionsStrings.enable_webcam_for_selfie)
    verifyElementCopy(this.instructions, cameraPermissionsStrings.click_allow)
    verifyElementCopy(this.allow, cameraPermissionsStrings.allow)
    verifyElementCopy(this.enableCameraButton, cameraPermissionsStrings.enable_webcam)
    this.graphic.isDisplayed()
  }

  async clickOnEnableCameraButton() {
    this.enableCameraButton.click()
  }
}

export default CameraPermissions;


