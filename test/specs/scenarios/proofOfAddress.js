import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import { uploadFileAndClickConfirmButton } from './sharedFlows.js'

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

      it('should verify UI elements of PoA Intro screen', async () => {
        driver.get(`${localhostUrl}?poa=true`)
        welcome.continueToNextStep()
        poaIntro.verifyTitle('Let’s verify your UK address')
        poaIntro.verifyRequirementsHeader(copy)
        poaIntro.verifyFirstRequirement('Shows your current address')
        poaIntro.verifySecondRequirement(
          'Matches the address you used on signup'
        )
        poaIntro.verifyThirdRequirement('Is your most recent document')
        poaIntro.verifyStartVerificationButton(copy)
      })

      it('should verify UI elements of PoA Document Selection screen', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.verifyTitle('Select a UK document')
        poaDocumentSelection.verifySubtitle(copy)
        poaDocumentSelection.verifyElementsBankCell(copy)
        poaDocumentSelection.verifyElementsUtilityBillCell(copy)
        poaDocumentSelection.verifyElementsCouncilTaxLetter(copy)
        poaDocumentSelection.verifyElementsBenefitsLetter(copy)
      })

      it('should verify UI elements of PoA Guidance for Bank Statement', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnBankIcon()
        poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(
          copy,
          'bank_building_society_statement'
        )
        poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(3)
      })

      it('should verify UI elements of PoA Guidance for Utility Bill', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnUtilityBillIcon()
        poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(
          copy,
          'utility_bill'
        )
        poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(3)
      })

      it('should verify UI elements of PoA Guidance for Council Tax Letter', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnCouncilTaxLetterIcon()
        poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(
          copy,
          'council_tax'
        )
        poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(12)
      })

      it('should verify UI elements of PoA Guidance for Benefits Letter', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnBenefitsLetterIcon()
        poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(
          copy,
          'benefit_letters'
        )
        poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(12)
      })

      it("should skip country selection screen with a preselected driver's license document type on PoA flow", async () => {
        driver.get(`${localhostUrl}?poa=true&oneDoc=driving_licence`)
        welcome.continueToNextStep()
        poaIntro.clickStartVerificationButton()
        poaDocumentSelection.clickOnCouncilTaxLetterIcon()
        poaGuidance.clickOnContinueButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'uk_driving_licence.png'
        )
        documentUpload.verifyFrontOfDrivingLicenceTitle(copy)
      })

      it('should upload Bank Statement and finish flow', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnBankIcon()
        poaGuidance.clickOnContinueButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.pdf'
        )
        documentSelector.clickOnPassportIcon()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        verificationComplete.verifyUIElements(copy)
      })

      it('should upload Utility Bill and finish flow', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnUtilityBillIcon()
        poaGuidance.clickOnContinueButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.pdf'
        )
        documentSelector.clickOnPassportIcon()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        verificationComplete.verifyUIElements(copy)
      })

      it('should upload Council Tax Letter and finish flow', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnCouncilTaxLetterIcon()
        poaGuidance.clickOnContinueButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.pdf'
        )
        documentSelector.clickOnDrivingLicenceIcon()
        countrySelector.selectSupportedCountry()
        countrySelector.clickSubmitDocumentButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'uk_driving_licence.png'
        )
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'back_driving_licence.jpg'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        verificationComplete.verifyUIElements(copy)
      })

      it('should upload Benefits Letter and finish flow', async () => {
        goToPoADocumentSelectionScreen()
        poaDocumentSelection.clickOnBenefitsLetterIcon()
        poaGuidance.clickOnContinueButton()
        uploadFileAndClickConfirmButton(
          documentUpload,
          confirm,
          'national_identity_card.pdf'
        )
        documentSelector.clickOnPassportIcon()
        documentUpload.clickUploadButton()
        uploadFileAndClickConfirmButton(
          passportUploadImageGuide,
          confirm,
          'passport.jpg'
        )
        uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
        verificationComplete.verifyUIElements(copy)
      })

      it('should succesfully complete cross device e2e flow with PoA document and selfie upload', async () => {
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
        crossDeviceLink.switchToCopyLinkOption()
        copyCrossDeviceLinkAndOpenInNewTab()
        switchBrowserTab(0)
        crossDeviceMobileConnected.tipsHeader().isDisplayed()
        switchBrowserTab(1)
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
        crossDeviceSubmit.clickOnSubmitVerificationButton()
        verificationComplete.verifyUIElements(copy)
      })
    }
  )
}
