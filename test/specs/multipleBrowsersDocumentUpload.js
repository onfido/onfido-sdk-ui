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
      confirm,
      documentUpload,
      crossDeviceIntro,
      passportUploadImageGuide,
    } = pageObjects

    const copy = basePage.copy()

    it('should upload document with JPG', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector)
      documentUpload.clickUploadButton()
      passportUploadImageGuide.verifyTitle(copy)
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
    })

    it('should upload document with PDF', async () => {
      driver.get(localhostUrl)
      welcome.continueToNextStep()
      documentSelector.clickOnIdentityCardIcon()
      uploadFileAndClickConfirmButton(
        documentUpload,
        confirm,
        'national_identity_card.pdf'
      )
    })

    it('should show cross device intro screen if camera not detected and uploadFallback disabled', async () => {
      goToPassportUploadScreen(
        driver,
        welcome,
        documentSelector,
        `?uploadFallback=false`
      )
      documentUpload.clickUploadButton()
      passportUploadImageGuide.verifyTitle(copy)
      uploadFileAndClickConfirmButton(
        passportUploadImageGuide,
        confirm,
        'passport.jpg'
      )
      crossDeviceIntro.verifyTitle(copy)
      crossDeviceIntro.verifySubTitle(copy)
      crossDeviceIntro.verifyMessages(copy)
    })
  }
)
