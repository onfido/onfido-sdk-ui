import { assert } from 'chai'
import { locale, verifyElementCopy } from '../utils/mochaw'
import { browserName, isRemoteBrowser } from '../main'
import remote from 'selenium-webdriver/remote'
import path from 'path'

class BasePage {
  constructor(driver, waitAndFind) {
    this.$ = waitAndFind
    this.driver = driver
  }

  async expectCurrentUrlToMatchUrl(expectedUrl) {
    assert.equal(
      this.driver.getCurrentUrl(),
      expectedUrl,
      `Test Failed: Browser URL has been modified`
    )
  }

  async title() {
    return this.$('.onfido-sdk-ui-PageTitle-titleSpan')
  }
  async subtitle() {
    return this.$('.onfido-sdk-ui-PageTitle-subTitle')
  }
  async backArrow() {
    return this.$('.onfido-sdk-ui-NavigationBar-iconBack')
  }
  async noLogo() {
    return this.$('.onfido-sdk-ui-Theme-noLogo')
  }
  async cobrandUI() {
    return this.$('.onfido-sdk-ui-Theme-cobrandFooter')
  }
  async cobrandLabel() {
    return this.$('.onfido-sdk-ui-Theme-cobrandLabel')
  }
  async cobrandText() {
    return this.$('.onfido-sdk-ui-Theme-cobrandText')
  }
  async cobrandLogo() {
    return this.$('.onfido-sdk-ui-Theme-logoCobrandImage')
  }
  async poweredBy() {
    return this.$('.onfido-sdk-ui-Theme-poweredBy')
  }
  async onfidoFooter() {
    return this.$('.onfido-sdk-ui-Theme-footer')
  }
  async spinner() {
    return this.$('.onfido-sdk-ui-Spinner-inner')
  }
  copy(lang) {
    return locale(lang)
  }

  async clickBackArrow() {
    this.backArrow().click()
  }

  async checkLogoIsHidden() {
    assert.isTrue(
      this.noLogo().isDisplayed(),
      'Test Failed: No logo should be displayed'
    )
  }

  async checkCobrandIsVisible() {
    assert.isTrue(
      this.cobrandUI().isDisplayed(),
      'Test Failed: Cobrand UI should be displayed'
    )
    assert.isTrue(
      this.cobrandLabel().isDisplayed(),
      'Test Failed: Cobrand text should be displayed'
    )
    verifyElementCopy(this.cobrandText(), '[COMPANY/PRODUCT NAME]')
    verifyElementCopy(this.poweredBy(), 'powered by')
  }

  async checkLogoCobrandIsVisible() {
    assert.isTrue(
      this.cobrandUI().isDisplayed(),
      'Test Failed: Cobrand UI should be displayed'
    )
    assert.isTrue(
      this.cobrandLabel().isDisplayed(),
      'Test Failed: Cobrand text should be displayed'
    )
    assert.isTrue(
      this.cobrandLogo().isDisplayed(),
      'Test Failed: Cobrand logo should be displayed'
    )
    verifyElementCopy(this.poweredBy(), 'powered by')
  }

  async upload(filename) {
    const input = this.$('.onfido-sdk-ui-CustomFileInput-input')
    const pathToTestFiles = '../resources/'
    //the below line...if safari AND Local, ignore it...otherwise file uploads will fail.
    if (browserName === 'safari' && isRemoteBrowser === false) {
      console.log(
        'Not creating a remote File Detector as I am uploading locally'
      )
    } else {
      // This will detect local file, ref: https://www.browserstack.com/automate/node#enhancements-uploads-downloads
      this.driver.setFileDetector(new remote.FileDetector())
    }
    const filePath = path.join(__dirname, pathToTestFiles + filename)
    let sendKeysToElement
    try {
      console.log(`File being uploaded is ${filePath}`)
      sendKeysToElement = input.sendKeys(path.join(filePath))
    } catch (err) {
      console.log('Just logging that I have caught an exception on upload')
    }
    return sendKeysToElement
  }
}

export default BasePage
