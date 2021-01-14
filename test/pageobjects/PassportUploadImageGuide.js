import path from 'path'
import remote from 'selenium-webdriver/remote'
import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'

export default class PassportUploadImageGuide extends BasePage {
  async docExampleImgCutOff() {
    return this.$('.onfido-sdk-ui-Uploader-documentExampleImgCutoff')
  }
  async docCutOffText() {
    return this.$('[data-onfido-qa="documentExampleLabelCutoff"]')
  }
  async docExampleImgBlur() {
    return this.$('.onfido-sdk-ui-Uploader-documentExampleImgBlur')
  }
  async docBlurText() {
    return this.$('[data-onfido-qa="documentExampleLabelBlur"]')
  }
  async docExampleImgGlare() {
    return this.$('.onfido-sdk-ui-Uploader-documentExampleImgGlare')
  }
  async docGlareText() {
    return this.$('[data-onfido-qa="documentExampleLabelGlare"]')
  }
  async docExampleImgGood() {
    return this.$('.onfido-sdk-ui-Uploader-documentExampleImgGood')
  }
  async docIsGoodText() {
    return this.$('[data-onfido-qa="documentExampleLabelGood"]')
  }
  async uploaderBtnText() {
    return this.$('[data-onfido-qa="image-guide-doc-upload-btn"]')
  }

  async uploadInput() {
    return this.$('.onfido-sdk-ui-CustomFileInput-input')
  }
  async getUploadInput() {
    const input = this.uploadInput()
    this.driver.executeScript((el) => {
      el.setAttribute(
        'style',
        'display: block !important; height: 100px; width: 200px;'
      )
    }, input)
    return input
  }

  async upload(filename) {
    // Input here cannot use the uploadInput() function above
    const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
    const pathToTestFiles = '../resources/'
    // This will detect local file, ref: https://www.browserstack.com/automate/node#enhancements-uploads-downloads
    this.driver.setFileDetector(new remote.FileDetector())
    const sendKeysToElement = input.sendKeys(
      path.join(__dirname, pathToTestFiles + filename)
    )
    return sendKeysToElement
  }

  async verifyUploaderButtonLabel(copy) {
    verifyElementCopy(this.uploaderBtnText(), copy.upload_guide.button_primary)
  }

  async verifyTitle(copy) {
    verifyElementCopy(this.title(), copy.upload_guide.title)
  }

  async verifySubTitle(copy) {
    verifyElementCopy(this.subtitle(), copy.upload_guide.subtitle)
  }

  async verifyPassportGuideUIElements(copy) {
    this.docExampleImgCutOff().isDisplayed()
    verifyElementCopy(
      this.docCutOffText(),
      copy.upload_guide.image_detail_cutoff_label
    )

    this.docExampleImgBlur().isDisplayed()
    verifyElementCopy(
      this.docBlurText(),
      copy.upload_guide.image_detail_blur_label
    )

    this.docExampleImgGlare().isDisplayed()
    verifyElementCopy(
      this.docGlareText(),
      copy.upload_guide.image_detail_glare_label
    )

    this.docExampleImgGood().isDisplayed()
    verifyElementCopy(
      this.docIsGoodText(),
      copy.upload_guide.image_detail_good_label
    )
  }
}
