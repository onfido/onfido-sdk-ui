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
        await poaIntro.clickStartVerificationButton()
      }

      it('should verify UI elements of PoA Intro screen @percy', async () => {
        driver.get(`${localhostUrl}?poa=true`)
        welcome.continueToNextStep()
        poaIntro.verifyTitle('Let’s verify your UK address')
        await poaIntro.verifyRequirementsHeader(copy)
        await poaIntro.verifyFirstRequirement('Shows your current address')
        await poaIntro.verifySecondRequirement(
          'Matches the address you used on signup'
        )
        await poaIntro.verifyThirdRequirement('Is your most recent document')
        await poaIntro.verifyStartVerificationButton(copy)
        await takePercySnapshot(
          driver,
          `Should verify UI elements of PoA Intro screen`
        )
      })

      it('should verify UI elements of PoA Document Selection screen @percy', async () => {
        await goToPoADocumentSelectionScreen()
        poaDocumentSelection.verifyTitle('Select a UK document')
        await poaDocumentSelection.verifySubtitle(copy)
        await poaDocumentSelection.verifyElementsBankCell(copy)
        await poaDocumentSelection.verifyElementsUtilityBillCell(copy)
        await poaDocumentSelection.verifyElementsCouncilTaxLetter(copy)
        await poaDocumentSelection.verifyElementsBenefitsLetter(copy)
        await takePercySnapshot(driver, 'Select a UK document screen')
      })

      it('should verify UI elements of PoA Guidance for Bank Statement @percy', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnBankIcon()
        await poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(
          copy,
          'bank_building_society_statement'
        )
        await poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(3)
        await takePercySnapshot(driver, 'Submit Statement screen')
      })

      it('should verify UI elements of PoA Guidance for Utility Bill @percy', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnUtilityBillIcon()
        await poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(
          copy,
          'utility_bill'
        )
        await poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(3)
        await takePercySnapshot(driver, 'Submit bill screen')
      })

      it('should verify UI elements of PoA Guidance for Council Tax Letter @percy', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnCouncilTaxLetterIcon()
        await poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(
          copy,
          'council_tax'
        )
        await poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(12)
        await takePercySnapshot(driver, 'Submit council tax letter screen')
      })

      it('should verify UI elements of PoA Guidance for Benefits Letter @percy', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnBenefitsLetterIcon()
        await poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(
          copy,
          'benefit_letters'
        )
        await poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(12)
        await takePercySnapshot(driver, 'Submit benefit letter screen')
      })

      it("should skip country selection screen with a preselected driver's license document type on PoA flow @percy", async () => {
        driver.get(`${localhostUrl}?poa=true&oneDoc=driving_licence`)
        welcome.continueToNextStep()
        await poaIntro.clickStartVerificationButton()
        await poaDocumentSelection.clickOnCouncilTaxLetterIcon()
        await poaGuidance.clickOnContinueButton()
        await takePercySnapshot(driver, 'Submit letter upload screen')
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'uk_driving_licence.png'
        )
        await documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
      })

      it('should upload Bank Statement and finish flow', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnBankIcon()
        await poaGuidance.clickOnContinueButton()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.pdf'
        )
        await documentSelector.clickOnPassportIcon()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        verificationComplete.verifyUIElements(copy)
      })

      it('should upload Utility Bill and finish flow', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnUtilityBillIcon()
        await poaGuidance.clickOnContinueButton()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.pdf'
        )
        await documentSelector.clickOnPassportIcon()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        verificationComplete.verifyUIElements(copy)
      })

      it('should upload Council Tax Letter and finish flow', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnCouncilTaxLetterIcon()
        await poaGuidance.clickOnContinueButton()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.pdf'
        )
        await documentSelector.clickOnDrivingLicenceIcon()
        await countrySelector.selectSupportedCountry()
        await countrySelector.clickSubmitDocumentButton()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'uk_driving_licence.png'
        )
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'back_driving_licence.jpg'
        )
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        verificationComplete.verifyUIElements(copy)
      })

      it('should upload Benefits Letter and finish flow', async () => {
        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnBenefitsLetterIcon()
        await poaGuidance.clickOnContinueButton()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.pdf'
        )
        await documentSelector.clickOnPassportIcon()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        verificationComplete.verifyUIElements(copy)
      })

      it('should succesfully complete cross device e2e flow with PoA document and selfie upload @percy', async () => {
        const copyCrossDeviceLinkAndOpenInNewTab = async () => {
          const crossDeviceLinkText = crossDeviceLink
            .copyLinkTextContainer()
            .getText()
          driver.executeScript("window.open('your url','_blank');")
          await switchBrowserTab(1)
          driver.get(crossDeviceLinkText)
        }

        const switchBrowserTab = async (tab) => {
          const browserWindows = driver.getAllWindowHandles()
          await driver.switchTo().window(browserWindows[tab])
        }

        await goToPoADocumentSelectionScreen()
        await poaDocumentSelection.clickOnBankIcon()
        await poaGuidance.clickOnContinueButton()
        await documentUpload.switchToCrossDevice()
        crossDeviceIntro.continueToNextStep()
        assert.isTrue(
          crossDeviceLink.qrCode().isDisplayed(),
          'Test Failed: QR Code should be visible'
        )
        await crossDeviceLink.switchToCopyLinkOption()
        await crossDeviceLink.verifyCopyLinkTextContainer()
        await copyCrossDeviceLinkAndOpenInNewTab()
        assert.isTrue(
          crossDeviceClientIntro.title().isDisplayed(),
          'Test Failed: Cross Device Client Session Intro title should be visible'
        )
        await switchBrowserTab(0)
        await crossDeviceMobileConnected.tipsHeader().isDisplayed()
        await takePercySnapshot(driver, 'Connected to your mobile screen')
        await switchBrowserTab(1)
        crossDeviceClientIntro.continueToNextStep()
        await takePercySnapshot(driver, 'Submit PoA bank statement')
        await documentUpload.uploaderBtn().isDisplayed()
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'passport.jpg'
        )
        await documentSelector.clickOnPassportIcon()
        await documentUpload.clickUploadButton()
        await uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        await uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'face.jpeg'
        )
        crossDeviceClientSuccess.verifyUIElements(copy)
        await switchBrowserTab(0)
        await crossDeviceSubmit.documentUploadedMessage().isDisplayed()
        await takePercySnapshot(
          driver,
          'Cross Device - Submit Verification screen'
        )
        await crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })
    }
  )
}
