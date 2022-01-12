import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import {
  takePercySnapshot,
  uploadFileAndClickConfirmButton,
} from './sharedFlows.js'
import { assert } from 'chai'

const options = {
  pageObjects: [
    'Welcome',
    'Confirm',
    'DocumentSelector',
    'CountrySelector',
    'PassportUploadImageGuide',
    'DocumentUpload',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceMobileConnected',
    'CrossDeviceClientIntro',
    'CrossDeviceClientSuccess',
    'CrossDeviceSubmit',
    'PoaDocumentSelection',
    'PoaGuidance',
    'PoaIntro',
    'VerificationComplete',
    'BasePage',
  ],
}

export const proofOfAddressScenarios = async (lang = 'en_US') => {
  describe(
    `PROOF OF ADDRESS scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        confirm,
        documentSelector,
        countrySelector,
        passportUploadImageGuide,
        documentUpload,
        crossDeviceIntro,
        crossDeviceLink,
        crossDeviceMobileConnected,
        crossDeviceClientIntro,
        crossDeviceClientSuccess,
        crossDeviceSubmit,
        poaDocumentSelection,
        poaGuidance,
        poaIntro,
        verificationComplete,
        basePage,
      } = pageObjects

      const copy = basePage.copy(lang)

      const goToPoADocumentSelectionScreen = async () => {
        driver.get(`${localhostUrl}?poa=true&useUploader=true`)
        welcome.continueToNextStep()
        poaIntro.clickStartVerificationButton()
      }

      it("should skip country selection screen with a preselected driver's license document type on PoA flow @percy", async () => {
        driver.get(`${localhostUrl}?poa=true&oneDoc=driving_licence`)
        welcome.continueToNextStep()
        poaIntro.clickStartVerificationButton()
        poaDocumentSelection.clickOnCouncilTaxLetterIcon()
        poaGuidance.clickOnContinueButton()
        await takePercySnapshot(driver, 'Submit letter upload screen')
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'uk_driving_licence.png'
        )
        documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
      })

      it('should succesfully complete cross device e2e flow with PoA document and selfie upload @percy', async () => {
        const copyCrossDeviceLinkAndOpenInNewTab = async () => {
          const crossDeviceLinkText = crossDeviceLink
            .copyLinkTextContainer()
            .getText()
          driver.executeScript("window.open('your url','_blank');")
          switchBrowserTab(1)
          driver.get(crossDeviceLinkText)
        }

        const switchBrowserTab = async (tab) => {
          const browserWindows = driver.getAllWindowHandles()
          driver.switchTo().window(browserWindows[tab])
        }

        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnBankIcon()
        poaGuidance.clickOnContinueButton()
        documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
        assert.isTrue(
          crossDeviceLink.qrCode().isDisplayed(),
          'Test Failed: QR Code should be visible'
        )
        crossDeviceLink.switchToCopyLinkOption()
        crossDeviceLink.verifyCopyLinkTextContainer()
        copyCrossDeviceLinkAndOpenInNewTab()
        assert.isTrue(
          crossDeviceClientIntro.title().isDisplayed(),
          'Test Failed: Cross Device Client Session Intro title should be visible'
        )
        switchBrowserTab(0)
        crossDeviceMobileConnected.tipsHeader().isDisplayed()
        await takePercySnapshot(driver, 'Connected to your mobile screen')
        switchBrowserTab(1)
        crossDeviceClientIntro.continueToNextStep()
        await takePercySnapshot(driver, 'Submit PoA bank statement')
        documentUpload.uploaderBtn().isDisplayed()
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
        documentSelector.clickOnPassportIcon()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        crossDeviceClientSuccess.verifyUIElements(copy)
        switchBrowserTab(0)
        crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        await takePercySnapshot(
          driver,
          'Cross Device - Submit Verification screen'
        )
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })
    }
  )
}
