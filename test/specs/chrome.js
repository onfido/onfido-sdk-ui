import { describe, it } from '../utils/mochaw'
import { welcomeScenarios } from './scenarios/welcome'
import { documentSelectorScenarios } from './scenarios/documentSelector'
import { documentScenarios } from './scenarios/document'
import { faceScenarios } from './scenarios/face'
const supportedLanguage = ["en", "es"]

const options = {
  pageObjects: ['DocumentSelector', 'Welcome', 'DocumentUpload', 'DocumentUploadConfirmation', 'VerificationComplete', 'CrossDeviceIntro', 'CrossDeviceLink', 'CrossDeviceMobileNotificationSent', 'CrossDeviceMobileConnected', 'CrossDeviceClientSuccess', `CrossDeviceSubmit`, `PoaIntro`, `PoaDocumentSelection`, `PoaGuidance`, `Common`, `CameraPermissions`, `LivenessIntro`]
}

const localhostUrl = 'https://localhost:8080/'

describe('Happy Paths', options, ({driver, pageObjects}) => {
  const {documentSelector, welcome, documentUpload, documentUploadConfirmation, verificationComplete, crossDeviceIntro, crossDeviceLink, crossDeviceMobileNotificationSent, crossDeviceMobileConnected, crossDeviceClientSuccess, crossDeviceSubmit, poaIntro, poaDocumentSelection, poaGuidance, common, cameraPermissions, livenessIntro} = pageObjects

  supportedLanguage.forEach((lang) => {
    welcomeScenarios(driver, pageObjects, lang)
    documentSelectorScenarios(driver, pageObjects, lang)
    documentScenarios(driver, pageObjects, lang)
    faceScenarios(driver, pageObjects, lang)
  })

  describe('CROSS DEVICE SYNC', async () => {

    describe('cross device sync intro screen', async () =>  {

      supportedLanguage.forEach( (lang) => {

        it('should verify UI elements on the cross device intro screen', async () => {
          driver.get(localhostUrl + `?language=${lang}`)
          const crossDeviceIntroCopy = documentSelector.copy(lang)
          welcome.primaryBtn.click()
          documentSelector.passportIcon.click()
          documentUpload.crossDeviceIcon.click()
          crossDeviceIntro.verifyTitle(crossDeviceIntroCopy)
          crossDeviceIntro.verifyIcons(crossDeviceIntroCopy)
          crossDeviceIntro.verifyMessages(crossDeviceIntroCopy)
        })
      })
    })

    describe('cross device sync screen', async () => {

      const testDeviceMobileNumber = '07495 023357'

      const goToCrossDeviceScreen = async () => {
        welcome.primaryBtn.click()
        documentSelector.passportIcon.click()
        documentUpload.crossDeviceIcon.click()
        crossDeviceIntro.continueButton.click()
      }

      const waitForAlertToAppearAndSendSms = async () => {
        driver.sleep(1000)
        driver.switchTo().alert().accept()
        crossDeviceLink.clickOnSendLinkButton()
        driver.sleep(2000)
      }

      supportedLanguage.forEach( (lang) => {

        it('should verify UI elements on the cross device sync screen', async () => {
          driver.get(localhostUrl + `?language=${lang}`)
          const crossDeviceSyncCopy = documentSelector.copy(lang)
          goToCrossDeviceScreen()
          crossDeviceLink.verifyTitle(crossDeviceSyncCopy)
          crossDeviceLink.verifySubtitle(crossDeviceSyncCopy)
          crossDeviceLink.verifyNumberInputLabel(crossDeviceSyncCopy)
          crossDeviceLink.verifyNumberInput()
          crossDeviceLink.verifySendLinkBtn(crossDeviceSyncCopy)
          crossDeviceLink.verifyCopyLinkInsteadLabel(crossDeviceSyncCopy)
          crossDeviceLink.verifyCopyToClipboardBtn(crossDeviceSyncCopy)
          crossDeviceLink.verifyCopyLinkTextContainer()
          crossDeviceLink.verifyDivider()
        })

        it('should change the state of the copy to clipboard button after clicking', async () => {
          driver.get(localhostUrl + `?language=${lang}`)
          const crossDeviceSyncCopy = documentSelector.copy(lang)
          goToCrossDeviceScreen()
          crossDeviceLink.copyToClipboardBtn.click()
          crossDeviceLink.verifyCopyToClipboardBtnChangedState(crossDeviceSyncCopy)
        })

        it('should display error when number is not provided', async () => {
          driver.get(localhostUrl + `?language=${lang}`)
          const crossDeviceSyncCopy = documentSelector.copy(lang)
          goToCrossDeviceScreen()
          crossDeviceLink.typeMobileNumber('123456789')
          crossDeviceLink.clickOnSendLinkButton()
          crossDeviceLink.verifyCheckNumberCorrectError(crossDeviceSyncCopy)
        })

        it('should display error when number is wrong', async () => {
          driver.get(localhostUrl + `?language=${lang}`)
          const crossDeviceSyncCopy = documentSelector.copy(lang)
          goToCrossDeviceScreen()
          crossDeviceLink.typeMobileNumber('123456789')
          crossDeviceLink.clickOnSendLinkButton()
          driver.sleep(500)
          crossDeviceLink.verifyCheckNumberCorrectError(crossDeviceSyncCopy)
        })

        it('should send sms and navigate to check your mobile screen ', async () => {
          const crossDeviceMobileNotificationSentCopy = crossDeviceMobileNotificationSent.copy(lang)
          driver.get(localhostUrl + `?language=${lang}`)
          goToCrossDeviceScreen()
          crossDeviceLink.typeMobileNumber(testDeviceMobileNumber)
          crossDeviceLink.clickOnSendLinkButton()
          waitForAlertToAppearAndSendSms()
          crossDeviceMobileNotificationSent.verifyTitle(crossDeviceMobileNotificationSentCopy)
        })

        describe('cross device check your mobile screen', async () => {

          it('should verify UI elements of the cross device check your mobile screen', async () => {
            driver.get(localhostUrl + `?language=${lang}`)
            const crossDeviceMobileNotificationSentCopy = crossDeviceMobileNotificationSent.copy(lang)
            goToCrossDeviceScreen()
            crossDeviceLink.typeMobileNumber('07495 023357')
            crossDeviceLink.clickOnSendLinkButton()
            waitForAlertToAppearAndSendSms()
            crossDeviceMobileNotificationSent.verifyTitle(crossDeviceMobileNotificationSentCopy)
            if (lang === 'en') {
              crossDeviceMobileNotificationSent.verifySubmessage('We’ve sent a secure link to +447495023357')
            } else {
              crossDeviceMobileNotificationSent.verifySubmessage('Hemos enviado un enlace seguro a +447495023357')
            }
            crossDeviceMobileNotificationSent.verifyMayTakeFewMinutesMessage(crossDeviceMobileNotificationSentCopy)
            crossDeviceMobileNotificationSent.verifyTipsHeader(crossDeviceMobileNotificationSentCopy)
            crossDeviceMobileNotificationSent.verifyTips(crossDeviceMobileNotificationSentCopy)
            crossDeviceMobileNotificationSent.verifyResendLink(crossDeviceMobileNotificationSentCopy)
          })

          it('should be able to resend sms', async () => {
            driver.get(localhostUrl)
            const crossDeviceMobileNotificationSentCopy = crossDeviceMobileNotificationSent.copy()
            goToCrossDeviceScreen()
            crossDeviceLink.typeMobileNumber('07495 023357')
            crossDeviceLink.clickOnSendLinkButton()
            waitForAlertToAppearAndSendSms()
            crossDeviceMobileNotificationSent.clickResendLink()
            crossDeviceLink.clickOnSendLinkButton()
            waitForAlertToAppearAndSendSms()
            crossDeviceMobileNotificationSent.verifyTitle(crossDeviceMobileNotificationSentCopy)
          })
        })

        describe('cross device e2e flow', async () => {
          const documentUploadCopy = documentUpload.copy(lang)
          const mobileConnectedCopy = crossDeviceMobileConnected.copy(lang)
          const uploadsSuccessfulCopy = crossDeviceClientSuccess.copy(lang)
          const crossDeviceSubmitCopy = crossDeviceSubmit.copy(lang)
          const verificationCompleteCopy = verificationComplete.copy(lang)

          const goToPassportUploadScreen = async (parameter='') => {
            driver.get(localhostUrl + parameter)
            welcome.primaryBtn.click()
            documentSelector.passportIcon.click()
          }

          const uploadFileAndClickConfirmButton = async (fileName) => {
            documentUpload.getUploadInput()
            documentUpload.upload(fileName)
            documentUploadConfirmation.confirmBtn.click()
          }

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

          it('should succesfully complete cross device e2e flow with selfie upload', async () => {
            goToPassportUploadScreen(`?language=${lang}&?async=false&useWebcam=false`)
            uploadFileAndClickConfirmButton('passport.jpg')
            documentUpload.crossDeviceIcon.click()
            crossDeviceIntro.continueButton.click()
            copyCrossDeviceLinkAndOpenInNewTab()
            switchBrowserTab(0)
            driver.sleep(2000)
            crossDeviceMobileConnected.verifyUIElements(mobileConnectedCopy)
            switchBrowserTab(1)
            driver.sleep(1000)
            documentUpload.verifySelfieUploadTitle(documentUploadCopy)
            uploadFileAndClickConfirmButton('face.jpeg')
            crossDeviceClientSuccess.verifyUIElements(uploadsSuccessfulCopy)
            switchBrowserTab(0)
            driver.sleep(1000)
            crossDeviceSubmit.verifyUIElements(crossDeviceSubmitCopy)
            crossDeviceSubmit.clickOnSubmitVerificationButton()
            verificationComplete.verifyUIElements(verificationCompleteCopy)
          })

          it('should succesfully complete cross device e2e flow with document and selfie upload', async () => {
            goToPassportUploadScreen(`?language=${lang}&?async=false&useWebcam=false`)
            documentUpload.crossDeviceIcon.click()
            crossDeviceIntro.continueButton.click()
            copyCrossDeviceLinkAndOpenInNewTab()
            switchBrowserTab(0)
            driver.sleep(2000)
            crossDeviceMobileConnected.verifyUIElements(mobileConnectedCopy)
            switchBrowserTab(1)
            driver.sleep(1000)
            uploadFileAndClickConfirmButton('passport.jpg')
            uploadFileAndClickConfirmButton('face.jpeg')
            crossDeviceClientSuccess.verifyUIElements(uploadsSuccessfulCopy)
            switchBrowserTab(0)
            driver.sleep(1000)
            crossDeviceSubmit.verifyUIElements(crossDeviceSubmitCopy)
            crossDeviceSubmit.clickOnSubmitVerificationButton()
            verificationComplete.verifyUIElements(verificationCompleteCopy)
          })
        })
      })
    })
  })

  describe('PROOF OF ADDRESS', async () => {

    const goToPoADocumentSelectionScreen = async () => {
      driver.get(localhostUrl + `?poa=true&async=false&useWebcam=false`)
      welcome.primaryBtn.click()
      poaIntro.clickStartVerificationButton()
    }

    const uploadFileAndClickConfirmButton = async (fileName) => {
      documentUpload.getUploadInput()
      documentUpload.upload(fileName)
      documentUploadConfirmation.confirmBtn.click()
    }

    it('should verify UI elements of PoA Intro screen', async () => {
      const poaIntroCopy = poaIntro.copy()
      driver.get(localhostUrl + `?poa=true`)
      welcome.primaryBtn.click()
      poaIntro.verifyTitle('Let’s verify your UK address')
      poaIntro.verifyRequirementsHeader(poaIntroCopy)
      poaIntro.verifyFirstRequirement('Shows your current address')
      poaIntro.verifySecondRequirement('Matches the address you used on signup')
      poaIntro.verifyThirdRequirement('Is your most recent document')
      poaIntro.verifyStartVerificationButton(poaIntroCopy)
    })

    it('should verify UI elements of PoA Document Selection screen', async () => {
      const poaDocumentSelectionCopy = poaDocumentSelection.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.verifyTitle('Select a UK document')
      poaDocumentSelection.verifySubtitle(poaDocumentSelectionCopy)
      poaDocumentSelection.verifyElementsBankCell(poaDocumentSelectionCopy)
      poaDocumentSelection.verifyElementsUtilityBillCell(poaDocumentSelectionCopy)
      poaDocumentSelection.verifyElementsCouncilTaxLetter(poaDocumentSelectionCopy)
      poaDocumentSelection.verifyElementsBenefitsLetter(poaDocumentSelectionCopy)
    })

    it('should verify UI elements of PoA Guidance for Bank Statement', async () => {
      const poaGuidanceCopy = poaGuidance.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnBankIcon()
      poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(poaGuidanceCopy, 'bank_building_society_statement')
      poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(3)
    })

    it('should verify UI elements of PoA Guidance for Utility Bill', async () => {
      const poaGuidanceCopy = poaGuidance.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnUtilityBillIcon()
      poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(poaGuidanceCopy, 'utility_bill')
      poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(3)
    })

    it('should verify UI elements of PoA Guidance for Council Tax Letter', async () => {
      const poaGuidanceCopy = poaGuidance.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnCouncilTaxLetterIcon()
      poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(poaGuidanceCopy, 'council_tax')
      poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(12)
    })

    it('should verify UI elements of PoA Guidance for Benefits Letter', async () => {
      const poaGuidanceCopy = poaGuidance.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnBenefitsLetterIcon()
      poaGuidance.verifyCopiesOnPoADocumentsGuidanceScreen(poaGuidanceCopy, 'benefit_letters')
      poaGuidance.verifyTextOfTheElementsForPoADocumentsGuidance(12)
    })

    it('should upload Bank Stetement and finish flow', async () => {
      const verificationCompleteCopy = verificationComplete.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnBankIcon()
      poaGuidance.clickOnContinueButton()
      uploadFileAndClickConfirmButton('national_identity_card.pdf')
      documentSelector.passportIcon.click()
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('face.jpeg')
      verificationComplete.verifyUIElements(verificationCompleteCopy)
    })

    it('should upload Utility Bill and finish flow', async () => {
      const verificationCompleteCopy = verificationComplete.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnUtilityBillIcon()
      poaGuidance.clickOnContinueButton()
      uploadFileAndClickConfirmButton('national_identity_card.pdf')
      documentSelector.passportIcon.click()
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('face.jpeg')
      verificationComplete.verifyUIElements(verificationCompleteCopy)
    })

    it('should upload Councit Tax Letter and finish flow', async () => {
      const verificationCompleteCopy = verificationComplete.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnCouncilTaxLetterIcon()
      poaGuidance.clickOnContinueButton()
      uploadFileAndClickConfirmButton('national_identity_card.pdf')
      documentSelector.passportIcon.click()
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('face.jpeg')
      verificationComplete.verifyUIElements(verificationCompleteCopy)
    })

    it('should upload Benefits Letter and finish flow', async () => {
      const verificationCompleteCopy = verificationComplete.copy()
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnBenefitsLetterIcon()
      poaGuidance.clickOnContinueButton()
      uploadFileAndClickConfirmButton('national_identity_card.pdf')
      documentSelector.passportIcon.click()
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('face.jpeg')
      verificationComplete.verifyUIElements(verificationCompleteCopy)
    })

    it('should succesfully complete cross device e2e flow with PoA document and selfie upload', async () => {
      const verificationCompleteCopy = verificationComplete.copy()

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
      driver.sleep(2000)
      switchBrowserTab(1)
      driver.sleep(1000)
      uploadFileAndClickConfirmButton('passport.jpg')
      documentSelector.clickOnPassportIcon()
      uploadFileAndClickConfirmButton('passport.jpg')
      uploadFileAndClickConfirmButton('face.jpeg')
      switchBrowserTab(0)
      driver.sleep(1000)
      crossDeviceSubmit.clickOnSubmitVerificationButton()
      verificationComplete.verifyUIElements(verificationCompleteCopy)
    })

    it('should navigate to cross device when forceCrossDevice set to true', async () => {
      driver.get(localhostUrl + `?forceCrossDevice=true`)
      const crossDeviceIntroCopy = crossDeviceIntro.copy()

      welcome.primaryBtn.click(crossDeviceIntroCopy)
      documentSelector.clickOnPassportIcon()
      crossDeviceIntro.verifyTitle(crossDeviceIntroCopy)
      crossDeviceIntro.verifyIcons()
      crossDeviceIntro.verifyMessages(crossDeviceIntroCopy)
    })
  })

  describe('MODAL VIEW', async () => {

    it('should be able to open, close and open again a modal view', async () => {
      driver.get(localhostUrl + `?useModal=true`)
      const welcomeCopy = welcome.copy()
      welcome.clickOnOpenModalButton()
      welcome.verifyTitle(welcomeCopy)
      driver.sleep(500)
      welcome.clickOnCloseModalButton()
      driver.sleep(500)
      welcome.clickOnOpenModalButton()
      welcome.verifyTitle(welcomeCopy)
    })
  })

  describe('BACK NAVIGATION', () => {

    supportedLanguage.forEach( (lang) => {

      const goToPassportUploadScreen = async (parameter='') => {
        driver.get(localhostUrl + parameter)
        welcome.primaryBtn.click()
        documentSelector.passportIcon.click()
      }

      const uploadFileAndClickConfirmButton = async (fileName) => {
        documentUpload.getUploadInput()
        documentUpload.upload(fileName)
        documentUploadConfirmation.confirmBtn.click()
      }

      it('should navigate to the second-last step of the flow and then go back to the beginning', async () => {
        const copy = common.copy(lang)
        goToPassportUploadScreen(`?language=${lang}&async=false&useWebcam=false`)
        uploadFileAndClickConfirmButton('passport.jpg')
        documentUpload.getUploadInput()
        documentUpload.upload('face.jpeg')
        common.clickBackArrow()
        documentUpload.verifySelfieUploadTitle(copy)
        common.clickBackArrow()
        documentUploadConfirmation.verifyCheckReadabilityMessage(copy)
        common.clickBackArrow()
        documentUpload.verifyPassportTitle(copy)
        common.clickBackArrow()
        documentSelector.verifyTitle(copy)
        common.clickBackArrow()
        welcome.verifyTitle(copy)
        welcome.checkBackArrowIsNotDisplayed()
      })
    })
  })

  describe('NO CAMERA, NO MediaRecorder', () => {

    supportedLanguage.forEach( (lang) => {

      const uploadFileAndClickConfirmButton = async (fileName) => {
        documentUpload.getUploadInput()
        documentUpload.upload(fileName)
        documentUploadConfirmation.confirmBtn.click()
      }

      it('should be taken to the cross-device flow if I do not have a camera and liveness variant requested', async () => {
        driver.get(localhostUrl + `?language=${lang}&liveness=true`)
        const crossDeviceIntroCopy = documentSelector.copy(lang)
        driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([])')
        welcome.primaryBtn.click()
        documentSelector.passportIcon.click()
        uploadFileAndClickConfirmButton('passport.jpg')
        crossDeviceIntro.verifyTitleForFace(crossDeviceIntroCopy)
      })

      it('should be taken to the selfie screen if browser does not have MediaRecorder API and liveness variant requested', async () => {
        driver.get(localhostUrl + `?language=${lang}&liveness=true`)
        const cameraPermissionsCopy = cameraPermissions.copy(lang)
        driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
        driver.executeScript('window.MediaRecorder = undefined')
        welcome.primaryBtn.click()
        documentSelector.passportIcon.click()
        uploadFileAndClickConfirmButton('passport.jpg')
        cameraPermissions.verifyUIElementsOnTheCameraPermissionsScreen(cameraPermissionsCopy)
      })

      it('should enter the liveness flow if I have a camera and liveness variant requested', async () => {
        driver.get(localhostUrl + `?language=${lang}&liveness=true`)
        const cameraPermissionsCopy = cameraPermissions.copy(lang)
        const livenessIntroCopy = livenessIntro.copy(lang)
        driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
        welcome.primaryBtn.click()
        documentSelector.passportIcon.click()
        uploadFileAndClickConfirmButton('passport.jpg')
        livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(livenessIntroCopy)
        livenessIntro.clickOnContinueButton()
        cameraPermissions.verifyUIElementsOnTheCameraPermissionsScreen(cameraPermissionsCopy)
      })
    })
  })
})
