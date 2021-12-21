import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import {
  takePercySnapshot,
  takePercySnapshotWithoutOverlay,
} from './sharedFlows.js'

const options = {
  pageObjects: [
    'Welcome',
    'DocumentSelector',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceClientIntro',
    'BasePage',
    'DocumentVideoCapture',
    'DocumentVideoConfirm',
    'DocumentVideoPreview',
    'CountrySelector',
  ],
}

export const crossDeviceDocumentVideoCaptureScenarios = async (lang) => {
  describe(
    `CROSS DEVICE Document Video Capture scenarios in ${lang}`,
    options,
    ({ driver, pageObjects }) => {
      const {
        welcome,
        documentSelector,
        crossDeviceIntro,
        crossDeviceLink,
        crossDeviceClientIntro,
        basePage,
        documentVideoCapture,
        documentVideoConfirm,
        documentVideoPreview,
        countrySelector,
      } = pageObjects

      const baseUrl = `${localhostUrl}?language=${lang}`

      const copy = basePage.copy(lang)

      const runThroughCrossDeviceFlowForDocumentVideoCapture = async () => {
        crossDeviceIntro.continueToNextStep()
        await crossDeviceLink.switchToCopyLinkOption()
        const linkText = crossDeviceLink.copyLinkTextContainer().getText()
        driver.executeScript("window.open('your url','_blank');")
        const browserWindows = await driver.getAllWindowHandles()
        const lastWindow = browserWindows[browserWindows.length - 1]
        await driver.switchTo().window(lastWindow)
        driver.sleep(500)
        driver.get(linkText)
        driver.sleep(1000)
        crossDeviceClientIntro.continueToNextStep()
        driver.sleep(500)
      }

      const userStartsCrossDeviceFlowForIdCard = async () => {
        driver.get(`${baseUrl}&docVideo=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnIdentityCardIcon()
        await countrySelector.searchFor('Italy')
        await countrySelector.selectFirstOptionInDropdownMenu()
        countrySelector.submitDocumentBtn().click()
        await runThroughCrossDeviceFlowForDocumentVideoCapture(copy)
      }

      const userStartsCrossDeviceFlowForResidentPermit = async () => {
        driver.get(`${baseUrl}&docVideo=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnResidencePermitIcon()
        await countrySelector.searchFor('United Kingdom')
        await countrySelector.selectFirstOptionInDropdownMenu()
        countrySelector.submitDocumentBtn().click()
        await runThroughCrossDeviceFlowForDocumentVideoCapture(copy)
      }

      const userCompletesAnssiFlowForUKResidentPermit = async () => {
        await userStartsCrossDeviceFlowForResidentPermit()
        await documentVideoCapture.userCompletesAnssiFlowForResidentPermit(copy)
        await documentVideoConfirm.userIsShownConfirmationDetails(copy)
      }

      const userFinishesRecordingAndIsTakenToConfirmationScreen = async (
        copy
      ) => {
        await documentVideoCapture.finishRecording(copy)
        await documentVideoCapture.successTick().isDisplayed()
        await documentVideoConfirm.userIsShownConfirmationDetails(copy)
      }

      afterEach(async () => {
        //Close any unused tabs after each test
        const browserWindows = await driver.getAllWindowHandles()
        if (browserWindows.length > 1) {
          const lastWindow = browserWindows[browserWindows.length - 1]
          await driver.switchTo().window(lastWindow)
          driver.close()
          await driver.switchTo().window(browserWindows[0])
        }
      })

      it('should start the ANSSI flow for Passport flow and attempt to upload @percy', async () => {
        driver.get(`${baseUrl}&docVideo=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnPassportIcon()
        await runThroughCrossDeviceFlowForDocumentVideoCapture(copy)
        await documentVideoCapture.backArrow().isDisplayed()
        await documentVideoCapture.passportOverlay().isDisplayed()
        await documentVideoCapture.userIsToldToKeepPassportPhotoPageWithinFrame(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to keep passport photo page within the frame ${lang}`
        )
        documentVideoCapture.startRecording(copy)
        await documentVideoCapture.overlayPlaceholder().isDisplayed()
        await documentVideoCapture.userIsToldToKeepStill(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to keep still ${lang}`
        )
        await documentVideoCapture.nextStepButtonIsNotSeen()
        await documentVideoCapture.nextStepButtonIsClicked(copy)
        await documentVideoCapture.userIsToldToHoldStill(copy)
        await documentVideoCapture.waitForLoadingBarToComplete()
        await documentVideoCapture.successTick().isDisplayed()
        await takePercySnapshotWithoutOverlay(
          driver,
          `User sees the success tick for Passport flow ${lang}`
        )
        await documentVideoConfirm.userIsShownConfirmationDetails(copy)
        await takePercySnapshot(
          driver,
          `User is shown confirmation screen ${lang}`
        )
        await documentVideoConfirm.uploadAndWaitForSpinner(copy)
      })

      it('should start the ANSSI flow for Identity Card flow and attempt to upload @percy', async () => {
        await userStartsCrossDeviceFlowForIdCard(copy)
        await documentVideoCapture.overlayPlaceholder().isDisplayed()
        await documentVideoCapture.paperOrPlasticCardSelectorSeenForIdCard(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is asked what type of identity card they have
        ${lang}`
        )
        documentVideoCapture.plasticCardButton().click()
        await documentVideoCapture.cardOverlay().isDisplayed()
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to keep the front within the frame ${lang}`
        )
        await documentVideoCapture.userStartsAndCompletesFirstPartOfCapture(
          copy
        )
        await documentVideoCapture.overlayPlaceholder().isDisplayed()
        await documentVideoCapture.progressSteps().isDisplayed()
        await documentVideoCapture.userIsToldToSlowlyTurnDocumentToShowTheBack(
          copy
        )
        await documentVideoCapture.userIsToldToKeepDocumentInFullViewAtAllTimes(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown step 2 of 2 for identity card flow and asked to turn the document around ${lang}`
        )
        await userFinishesRecordingAndIsTakenToConfirmationScreen(copy)
        await documentVideoConfirm.uploadAndWaitForSpinner(copy)
      })

      it('should start the ANSSI flow for Drivers license flow and attempt to upload @percy', async () => {
        driver.get(`${baseUrl}&docVideo=true`)
        welcome.continueToNextStep()
        await documentSelector.clickOnDrivingLicenceIcon()
        await countrySelector.searchFor('France')
        await countrySelector.selectFirstOptionInDropdownMenu()
        countrySelector.submitDocumentBtn().click()
        await runThroughCrossDeviceFlowForDocumentVideoCapture(copy)
        await documentVideoCapture.overlayPlaceholder().isDisplayed()
        await documentVideoCapture.paperOrPlasticCardSelectorSeenForDriversLicense(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is asked what type of license they have ${lang}`
        )
        documentVideoCapture.paperDocumentButton().click()
        await documentVideoCapture
          .frenchPaperDrivingLicenseOverlay()
          .isDisplayed()
        await documentVideoCapture.userIsGivenInstructionsForProfilePhotoSide(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to lay the document flat ${lang}`
        )
        await documentVideoCapture.userStartsAndCompletesFirstPartOfCapture(
          copy
        )
        await documentVideoCapture.overlayPlaceholder().isDisplayed()
        await documentVideoCapture.progressSteps().isDisplayed()
        await documentVideoCapture.userIsToldToTurnDocumentToShowTheOuterPages(
          copy
        )
        await documentVideoCapture.userIsToldToKeepDocumentInFullViewAtAllTimes(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown step 2 of 2 for drivers license flow and asked to slowly turn the document around ${lang}`
        )
        await userFinishesRecordingAndIsTakenToConfirmationScreen(copy)
        await documentVideoConfirm.uploadAndWaitForSpinner(copy)
      })

      it('should start the ANSSI flow for Residence permit flow and attempt to upload @percy', async () => {
        await userStartsCrossDeviceFlowForResidentPermit()
        await documentVideoCapture.cardOverlay().isDisplayed()
        await documentVideoCapture.userIsToldToKeepTheFrontSideOfTheDocumentWithinTheFrame(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to keep the front side within the frame ${lang}`
        )
        await documentVideoCapture.userStartsAndCompletesFirstPartOfCapture(
          copy
        )
        await documentVideoCapture.progressSteps().isDisplayed()
        await documentVideoCapture.userIsToldToSlowlyTurnDocumentToShowTheBack(
          copy
        )
        await documentVideoCapture.userIsToldToKeepDocumentInFullViewAtAllTimes(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is asked to slowly turn the document around to show the back ${lang}`
        )
        await userFinishesRecordingAndIsTakenToConfirmationScreen(copy)
        await documentVideoConfirm.uploadAndWaitForSpinner(copy)
      })

      it('should show "Camera not working" error in ANSSI flow @percy', async () => {
        await userStartsCrossDeviceFlowForIdCard(copy)
        await documentVideoCapture.overlayPlaceholder().isDisplayed()
        await documentVideoCapture.userIsShownCameraNotWorkingError(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown "Camera not working" error ${lang}`
        )
        await documentVideoCapture.userCanDismissError()
        await documentVideoCapture.cameraNotWorkingErrorIsNotSeen()
      })

      it('should show "Looks like you took too long error" in ANSSI flow @percy @longtest', async () => {
        await userStartsCrossDeviceFlowForResidentPermit()
        await documentVideoCapture.cardOverlay().isDisplayed()
        documentVideoCapture.startRecording(copy)
        await documentVideoCapture.verifyNextStepButtonLabel(copy)
        await documentVideoCapture.userIsShownLooksLikeYouTookTooLongError(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown "Looks like you took too long" error ${lang}`
        )
        await documentVideoCapture.userCanStartAgain()
        await documentVideoCapture.looksLikeYouTookTooLongErrorIsNotSeen()
        await documentVideoCapture.startRecordingButtonIsSeen(copy)
      })

      it('should allow user to preview/retake video in ANSSI flow @percy', async () => {
        await userCompletesAnssiFlowForUKResidentPermit(copy)
        await documentVideoConfirm.chooseToPreviewVideo(copy)
        await documentVideoPreview.checkYourVideoIsSeen(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown Check your video screen ${lang}`
        )
        await documentVideoPreview.chooseToRetakeVideo(copy)
        await documentVideoCapture.startRecordingButtonIsSeen(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is taken back to the start of the flow after choosing to retake video ${lang}`
        )
      })

      it('should allow user to go back and retake video in ANSSI flow after completing the flow @percy', async () => {
        await userCompletesAnssiFlowForUKResidentPermit(copy)
        documentVideoConfirm.backArrow().click()
        await documentVideoCapture.startRecordingButtonIsSeen(copy)
      })
    }
  )
}
