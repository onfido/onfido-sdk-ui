import { describe, it } from '../../utils/mochaw'
import { testDeviceMobileNumber } from '../../config.json'
import { localhostUrl } from '../../main'
import {
  goToPassportUploadScreen,
  uploadFileAndClickConfirmButton,
  switchBrowserTab,
} from './sharedFlows.js'
import { runAccessibilityTest } from '../../utils/accessibility'
import { until } from 'selenium-webdriver'

const options = {
  pageObjects: [
    'Welcome',
    'Confirm',
    'DocumentSelector',
    'CountrySelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'CrossDeviceClientSuccess',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceMobileConnected',
    'CrossDeviceSubmit',
    'FaceVideoIntro',
    'PoaDocumentSelection',
    'PoaGuidance',
    'PoaIntro',
    'VerificationComplete',
    'BasePage',
  ],
}

export const accessibilityScenarios = async (lang = 'en_US') => {
  describe(
    `ACCESSIBILITY scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        confirm,
        documentSelector,
        passportUploadImageGuide,
        documentUpload,
      } = pageObjects

      const baseUrl = `${localhostUrl}?language=${lang}`

      // TODO: tony says the tests doesn't do what the description says

      // Face
      it('should verify accessibility for the take a selfie screen', async () => {
        goToPassportUploadScreen(
          driver,
          welcome,
          documentSelector,
          `?language=${lang}`
        )
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        runAccessibilityTest(driver)
      })

    }
  )
}
