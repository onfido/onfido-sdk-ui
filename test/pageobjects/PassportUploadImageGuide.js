import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
const path = require('path')
const remote = require('selenium-webdriver/remote')

export default class PassportUploadImageGuide extends BasePage {

  async docExampleImgCutOff() { return this.$('.onfido-sdk-ui-Uploader-documentExampleImgCutoff')}
  async docCutOffText() { return this.$('[data-onfido-qa="documentExampleLabelCutoff"]')}
  async docExampleImgBlur() { return this.$('.onfido-sdk-ui-Uploader-documentExampleImgBlur')}
  async docBlurText() { return this.$('[data-onfido-qa="documentExampleLabelBlur"]')}
  async docExampleImgGlare() { return this.$('.onfido-sdk-ui-Uploader-documentExampleImgGlare')}
  async docGlareText() { return this.$('[data-onfido-qa="documentExampleLabelGlare"]')}
  async docExampleImgGood() { return this.$('.onfido-sdk-ui-Uploader-documentExampleImgGood')}
  async docIsGoodText() { return this.$('[data-onfido-qa="documentExampleLabelGood"]')}
  async uploaderBtnText() { return this.$('.onfido-sdk-ui-Button-button-text')}

  async uploadInput() { return this.$('.onfido-sdk-ui-CustomFileInput-input') }
  async getUploadInput() {
    const input = this.uploadInput()
    this.driver.executeScript((el) => {
      el.setAttribute('style','display: block !important; height: 100px; width: 200px;')
    }, input)
    return input
  }

  async upload(filename) {
    // Input here cannot use the uploadInput() function above
    const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
    const pathToTestFiles = '../resources/'
    // This will detect local file, ref: https://www.browserstack.com/automate/node#enhancements-uploads-downloads
    this.driver.setFileDetector(new remote.FileDetector())
    const sendKeysToElement = input.sendKeys(path.join(__dirname, pathToTestFiles + filename))
    return sendKeysToElement
  }

  async getPassportImageGuideCopy(copy) { return copy.image_quality_guide }

  async verifyUploaderButtonLabel(copy) {
    const passportGuideStrings = this.getPassportImageGuideCopy(copy)
    verifyElementCopy(this.uploaderBtnText(), passportGuideStrings.next_step)
  }

  async verifyTitle(copy) {
    const passportGuideStrings = this.getPassportImageGuideCopy(copy)
    verifyElementCopy(this.title(), passportGuideStrings.title)
  }

  async verifySubTitle(copy) {
    const passportGuideStrings = this.getPassportImageGuideCopy(copy)
    verifyElementCopy(this.subtitle(), passportGuideStrings.sub_title)
  }

  async verifyPassportGuideUIElements(copy) {
    const passportGuideStrings = this.getPassportImageGuideCopy(copy)

    this.docExampleImgCutOff().isDisplayed()
    verifyElementCopy(this.docCutOffText(), passportGuideStrings.not_cut_off.label)

    this.docExampleImgBlur().isDisplayed()
    verifyElementCopy(this.docBlurText(),passportGuideStrings.no_blur.label)

    this.docExampleImgGlare().isDisplayed()
    verifyElementCopy(this.docGlareText(),passportGuideStrings.no_glare.label)

    this.docExampleImgGood().isDisplayed()
    verifyElementCopy(this.docIsGoodText(),passportGuideStrings.all_good.label)
  }

}
