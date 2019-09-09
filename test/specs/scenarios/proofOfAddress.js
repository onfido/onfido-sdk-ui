import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import { uploadFileAndClickConfirmButton } from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'Confirm',
    'DocumentSelector',
    'DocumentUpload',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceMobileConnected',
    'CrossDeviceSubmit',
    'PoaDocumentSelection',
    'PoaGuidance',
    'PoaIntro',
    'VerificationComplete',
    'BasePage'
  ]
}

export const proofOfAddressScenarios = async(lang='en') => {

  describe(`PROOF OF ADDRESS scenarios in ${lang}`, options, ({driver, pageObjects}) => {

    const {
      welcome,
      confirm,
      documentSelector,
      documentUpload,
      crossDeviceIntro,
      crossDeviceLink,
      crossDeviceMobileConnected,
      crossDeviceSubmit,
      poaDocumentSelection,
      poaGuidance,
      poaIntro,
      verificationComplete,
      basePage
    } = pageObjects

    const copy = basePage.copy(lang)

    const goToPoADocumentSelectionScreen = async () => {
      driver.get(localhostUrl + `?poa=true&async=false&useWebcam=false`)
      welcome.primaryBtn.click()
      poaIntro.clickStartVerificationButton()
    }

    it('should verify UI elements of PoA Intro screen', async () => {
      driver.get(localhostUrl + `?poa=true`)
      welcome.primaryBtn.click()
      poaIntro.verifyTitle('Let’s verify your UK address')
      poaIntro.verifyRequirementsHeader(copy)
      poaIntro.verifyFirstRequirement('Shows your current address')
      poaIntro.verifySecondRequirement('Matches the address you used on signup')
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
      poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(copy, 'bank_building_society_statement')
      poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(3)
    })

    it('should verify UI elements of PoA Guidance for Utility Bill', async () => {
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnUtilityBillIcon()
      poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(copy, 'utility_bill')
      poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(3)
    })

    it('should verify UI elements of PoA Guidance for Council Tax Letter', async () => {
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnCouncilTaxLetterIcon()
      poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(copy, 'council_tax')
      poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(12)
    })

    it('should verify UI elements of PoA Guidance for Benefits Letter', async () => {
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnBenefitsLetterIcon()
      poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(copy, 'benefit_letters')
      poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(12)
    })

    it('should upload Bank Statement and finish flow', async () => {
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnBankIcon()
      poaGuidance.clickOnContinueButton()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'national_identity_card.pdf')
      documentSelector.passportIcon.click()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
    })

    it('should upload Utility Bill and finish flow', async () => {
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnUtilityBillIcon()
      poaGuidance.clickOnContinueButton()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'national_identity_card.pdf')
      documentSelector.passportIcon.click()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
    })

    it('should upload Council Tax Letter and finish flow', async () => {
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnCouncilTaxLetterIcon()
      poaGuidance.clickOnContinueButton()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'national_identity_card.pdf')
      documentSelector.passportIcon.click()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
    })

    it('should upload Benefits Letter and finish flow', async () => {
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnBenefitsLetterIcon()
      poaGuidance.clickOnContinueButton()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'national_identity_card.pdf')
      documentSelector.passportIcon.click()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      verificationComplete.verifyUIElements(copy)
    })

    it('should succesfully complete cross device e2e flow with PoA document and selfie upload', async () => {
      const copyCrossDeviceLinkAndOpenInNewTab = async () => {
        const crossDeviceLinkText = crossDeviceLink.copyLinkTextContainer.getText()
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
      documentUpload.crossDeviceIcon.click()
      crossDeviceIntro.continueButton.click()
      copyCrossDeviceLinkAndOpenInNewTab()
      switchBrowserTab(0)
      const tipsHeaderSelector = crossDeviceMobileConnected.tipsHeaderSelector
      crossDeviceMobileConnected.waitForElementToBeLocated(tipsHeaderSelector)
      switchBrowserTab(1)
      const uploaderInstructionsMessageSelector = documentUpload.uploaderInstructionsMessageSelector
      documentUpload.waitForElementToBeLocated(uploaderInstructionsMessageSelector)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      documentSelector.clickOnPassportIcon()
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      switchBrowserTab(0)
      const documentUploadedMessageSelector = crossDeviceSubmit.documentUploadedMessageSelector
      crossDeviceSubmit.waitForElementToBeLocated(documentUploadedMessageSelector)
      crossDeviceSubmit.clickOnSubmitVerificationButton()
      verificationComplete.verifyUIElements(copy)
    })

    it('should navigate to cross device when forceCrossDevice set to true', async () => {
      driver.get(localhostUrl + `?forceCrossDevice=true`)
      welcome.primaryBtn.click(copy)
      documentSelector.clickOnPassportIcon()
      crossDeviceIntro.verifyTitle(copy)
    })
  })
}
