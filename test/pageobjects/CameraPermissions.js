import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

class CameraPermissions extends BasePage {
  async instructions() {
    return this.$('.onfido-sdk-ui-CameraPermissions-Primer-instructions')
  }
  async graphic() {
    return this.$('.onfido-sdk-ui-CameraPermissions-Primer-graphic')
  }
  async enableCameraButton() {
    return this.$('[data-onfido-qa="enable-camera-btn"]')
  }

  async verifyUIElementsOnTheCameraPermissionsScreen(copy) {
    this.driver.sleep(500)
    await verifyElementCopy(this.title(), copy.permission.title_cam)
    await verifyElementCopy(this.subtitle(), copy.permission.subtitle_cam)
    await verifyElementCopy(this.instructions(), copy.permission.body_cam)
    await verifyElementCopy(
      this.enableCameraButton(),
      copy.permission.button_primary_cam
    )
    await this.graphic().isDisplayed()
  }

  async clickOnEnableCameraButton() {
    this.enableCameraButton().click()
  }
}

export default CameraPermissions
