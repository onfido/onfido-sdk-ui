import BasePage from './BasePage.js'
import { verifyElementCopy } from '../utils/mochaw'
const path = require('path')
const remote = require('selenium-webdriver/remote')

const getPassportImageGuideCopy = (copy) => copy.image_quality_guide

export default class PassportImageGuide extends BasePage {

  async docExampleImgCutOff() { return this.$('.onfido-sdk-ui-Uploader-documentExampleImgCutoff')}
  async docCutOffText() { return this.$('.onfido-sdk-ui-Uploader-documentExampleLabelCutoff')}
  async docExampleImgBlur() { return this.$('.onfido-sdk-ui-Uploader-documentExampleImgBlur')}
  async docBlurText() { return this.$('.onfido-sdk-ui-Uploader-documentExampleLabelBlur')}
  async docExampleImgGlare() { return this.$('.onfido-sdk-ui-Uploader-documentExampleImgGlare')}
  async docGlareText() { return this.$('.onfido-sdk-ui-Uploader-documentExampleLabelGlare')}
  async docExampleImgGood() { return this.$('.onfido-sdk-ui-Uploader-documentExampleImgGood')}
  async docIsGoodText() { return this.$('.onfido-sdk-ui-Uploader-documentExampleLabelGood')}
  async uploaderBtnText() { return this.$('.onfido-sdk-ui-Uploader-passportUploadContainer onfido-sdk-ui-Button-button-text')}

  async uploadInput() { return this.$('.onfido-sdk-ui-CustomFileInput-input') }
  async getUploadInput() {
    const input = this.uploadInput()
    this.driver.executeScript((el) => {
      el.setAttribute('style','display: block !important')
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

  async verifyUploaderButtonLabel(copy) {
    const imageGuideStrings = getPassportImageGuideCopy(copy)
    verifyElementCopy(this.uploaderBtnText(), imageGuideStrings.next_step)
  }

  async verifyTitle(copy) {
    const imageGuideStrings = getPassportImageGuideCopy(copy)
    verifyElementCopy(this.title(), imageGuideStrings.title)
  }

  async verifySubTitle(copy) {
    const imageGuideStrings = getPassportImageGuideCopy(copy)
    verifyElementCopy(this.subtitle(), imageGuideStrings.sub_title)
  }

  async verifyPassportGuideUIElements(copy) {
    const imageGuideStrings = getPassportImageGuideCopy(copy)

    this.docExampleImgCutOff().isDisplayed()
    verifyElementCopy(this.docCutOffText(), imageGuideStrings.not_cut_off)

    this.docExampleImgBlur().isDisplayed()
    verifyElementCopy(this.docBlurText(),imageGuideStrings.no_blur)

    this.docExampleImgGlare().isDisplayed()
    verifyElementCopy(this.docGlareText(),imageGuideStrings.no_glare)

    this.docExampleImgGood().isDisplayed()
    verifyElementCopy(this.docIsGoodText(),imageGuideStrings.all_good)
  }

}
