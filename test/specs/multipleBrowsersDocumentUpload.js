import { describe, it } from '../utils/mochaw'
import { localhostUrl } from '../config.json'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
} from './scenarios/sharedFlows'

const options = {
  pageObjects: [
    'BasePage',
    'Welcome',
    'DocumentSelector',
    'CountrySelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'CrossDeviceIntro',
    'Confirm',
  ],
}

describe(
  'DOCUMENT UPLOAD ON MULTIPLE BROWSERS',
  options,
  ({ driver, pageObjects }) => {
    const {
      basePage,
      welcome,
      documentSelector,
      countrySelector,
      confirm,
      documentUpload,
      crossDeviceIntro,
      passportUploadImageGuide,
    } = pageObjects

    const copy = basePage.copy()

    it('should upload document with JPG', async () => {
      await goToPassportUploadScreen(driver, welcome, documentSelector)
      await documentUpload.clickUploadButton()
      passportUploadImageGuide.verifyTitle(copy)
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
    })

    it('should upload passport document with PDF', async () => {
      await goToPassportUploadScreen(driver, welcome, documentSelector)
      await documentUpload.clickUploadButton()
      passportUploadImageGuide.verifyTitle(copy)
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.pdf'
      )
    })

    it('should upload id document with PDF', async () => {
      driver.get(localhostUrl)
      welcome.continueToNextStep()
      await documentSelector.clickOnIdentityCardIcon()
      await countrySelector.selectSupportedCountry()
      await countrySelector.clickSubmitDocumentButton()
      await documentUpload.clickUploadButtonIfRemoteIe()
      await uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'national_identity_card.pdf'
      )
    })

    it('should show cross device intro screen if camera not detected and uploadFallback disabled', async () => {
      await goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?uploadFallback=false`
      )
      await documentUpload.clickUploadButton()
      passportUploadImageGuide.verifyTitle(copy)
      await uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      crossDeviceIntro.verifyTitle(copy)
      await crossDeviceIntro.verifySubTitle(copy)
      await crossDeviceIntro.verifyMessages(copy)
    })
  }
)
