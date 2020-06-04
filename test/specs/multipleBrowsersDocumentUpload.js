import { describe, it } from '../utils/mochaw'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './scenarios/sharedFlows.js'
import { localhostUrl } from '../config.json'


const options = {
  pageObjects: [
    'BasePage',
    'Welcome',
    'DocumentSelector',
    'PassportImageGuide',
    'DocumentUpload',
    'CrossDeviceIntro',
    'Confirm'
  ],
}

const baseUrl = `${localhostUrl}`

describe('DOCUMENT UPLOAD ON MULTIPLE BROWSERS', options, ({driver, pageObjects}) => {

  const {
    basePage,
    welcome,
    documentSelector,
    confirm,
    documentUpload,
    passportImageGuide,
    crossDeviceIntro
  } = pageObjects

  const copy = basePage.copy()

  it('should upload document with JPG', async () => {
    goToPassportUploadScreen(driver, welcome, documentSelector)
    documentUpload.clickUploadButton()
    uploadFileAndClickConfirmButton(passportImageGuide, confirm, 'passport.jpg')
  })

  it('should upload document with PDF', async () => {
    goToPassportUploadScreen(driver, welcome, documentSelector)
    documentUpload.clickUploadButton()
    uploadFileAndClickConfirmButton(passportImageGuide, confirm, 'national_identity_card.pdf')
  })

  it('should show cross device intro screen if camera not detected and uploadFallback disabled', async () => {
    driver.get(`${baseUrl}&uploadFallback=false`)
    goToPassportUploadScreen(driver, welcome, documentSelector, `?uploadFallback=false`)
    uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
    crossDeviceIntro.verifyTitle(copy)
    crossDeviceIntro.verifySubTitle(copy)
    crossDeviceIntro.verifyMessages(copy)
  })
})