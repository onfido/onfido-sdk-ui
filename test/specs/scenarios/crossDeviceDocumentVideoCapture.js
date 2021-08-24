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
        crossDeviceLink.switchToCopyLinkOption()
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
        documentSelector.clickOnIdentityCardIcon()
        countrySelector.searchFor('Italy')
        countrySelector.selectFirstOptionInDropdownMenu()
        countrySelector.submitDocumentBtn().click()
        await runThroughCrossDeviceFlowForDocumentVideoCapture(copy)
      }

      const userStartsCrossDeviceFlowForResidentPermit = async () => {
        driver.get(`${baseUrl}&docVideo=true`)
        welcome.continueToNextStep()
        documentSelector.clickOnResidencePermitIcon()
        countrySelector.searchFor('United Kingdom')
        countrySelector.selectFirstOptionInDropdownMenu()
        countrySelector.submitDocumentBtn().click()
        await runThroughCrossDeviceFlowForDocumentVideoCapture(copy)
      }

      const userCompletesAnssiFlowForUKResidentPermit = async () => {
        await userStartsCrossDeviceFlowForResidentPermit()
        documentVideoCapture.userCompletesAnssiFlowForResidentPermit(copy)
        documentVideoConfirm.userIsShownConfirmationDetails(copy)
      }

      const userFinishesRecordingAndIsTakenToConfirmationScreen = async (
        copy
      ) => {
        documentVideoCapture.finishRecording(copy)
        documentVideoCapture.successTick().isDisplayed()
        documentVideoConfirm.userIsShownConfirmationDetails(copy)
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
        documentSelector.clickOnPassportIcon()
        runThroughCrossDeviceFlowForDocumentVideoCapture(copy)
        documentVideoCapture.backArrow().isDisplayed()
        documentVideoCapture.passportOverlay().isDisplayed()
        documentVideoCapture.userIsToldToKeepPassportPhotoPageWithinFrame(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to keep passport photo page within the frame ${lang}`
        )
        documentVideoCapture.startRecording(copy)
        documentVideoCapture.overlayPlaceholder().isDisplayed()
        documentVideoCapture.userIsToldToKeepStill(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to keep still ${lang}`
        )
        documentVideoCapture.nextStepButtonIsNotSeen()
        documentVideoCapture.nextStepButtonIsClicked(copy)
        documentVideoCapture.userIsToldToHoldStill(copy)
        documentVideoCapture.waitForLoadingBarToComplete()
        documentVideoCapture.successTick().isDisplayed()
        await takePercySnapshotWithoutOverlay(
          driver,
          `User sees the success tick for Passport flow ${lang}`
        )
        documentVideoConfirm.userIsShownConfirmationDetails(copy)
        await takePercySnapshot(
          driver,
          `User is shown confirmation screen ${lang}`
        )
        documentVideoConfirm.uploadAndWaitForSpinner(copy)
      })

      it('should start the ANSSI flow for Identity Card flow and attempt to upload @percy', async () => {
        userStartsCrossDeviceFlowForIdCard(copy)
        documentVideoCapture.overlayPlaceholder().isDisplayed()
        documentVideoCapture.paperOrPlasticCardSelectorSeenForIdCard(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is asked what type of identity card they have
        ${lang}`
        )
        documentVideoCapture.plasticCardButton().click()
        documentVideoCapture.cardOverlay().isDisplayed()
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to keep the front within the frame ${lang}`
        )
        documentVideoCapture.userStartsAndCompletesFirstPartOfCapture(copy)
        documentVideoCapture.overlayPlaceholder().isDisplayed()
        documentVideoCapture.progressSteps().isDisplayed()
        documentVideoCapture.userIsToldToSlowlyTurnDocumentToShowTheBack(copy)
        documentVideoCapture.userIsToldToKeepDocumentInFullViewAtAllTimes(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown step 2 of 2 for identity card flow and asked to turn the document around ${lang}`
        )
        userFinishesRecordingAndIsTakenToConfirmationScreen(copy)
        documentVideoConfirm.uploadAndWaitForSpinner(copy)
      })

      it('should start the ANSSI flow for Drivers license flow and attempt to upload @percy', async () => {
        driver.get(`${baseUrl}&docVideo=true`)
        welcome.continueToNextStep()
        documentSelector.clickOnDrivingLicenceIcon()
        countrySelector.searchFor('France')
        countrySelector.selectFirstOptionInDropdownMenu()
        countrySelector.submitDocumentBtn().click()
        runThroughCrossDeviceFlowForDocumentVideoCapture(copy)
        documentVideoCapture.overlayPlaceholder().isDisplayed()
        documentVideoCapture.paperOrPlasticCardSelectorSeenForDriversLicense(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is asked what type of license they have ${lang}`
        )
        documentVideoCapture.paperDocumentButton().click()
        documentVideoCapture.frenchPaperDrivingLicenseOverlay().isDisplayed()
        documentVideoCapture.userIsGivenInstructionsForProfilePhotoSide(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to lay the document flat ${lang}`
        )
        documentVideoCapture.userStartsAndCompletesFirstPartOfCapture(copy)
        documentVideoCapture.overlayPlaceholder().isDisplayed()
        documentVideoCapture.progressSteps().isDisplayed()
        documentVideoCapture.userIsToldToTurnDocumentToShowTheOuterPages(copy)
        documentVideoCapture.userIsToldToKeepDocumentInFullViewAtAllTimes(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown step 2 of 2 for drivers license flow and asked to slowly turn the document around ${lang}`
        )
        userFinishesRecordingAndIsTakenToConfirmationScreen(copy)
        documentVideoConfirm.uploadAndWaitForSpinner(copy)
      })

      it('should start the ANSSI flow for Residence permit flow and attempt to upload @percy', async () => {
        userStartsCrossDeviceFlowForResidentPermit()
        documentVideoCapture.cardOverlay().isDisplayed()
        documentVideoCapture.userIsToldToKeepTheFrontSideOfTheDocumentWithinTheFrame(
          copy
        )
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is told to keep the front side within the frame ${lang}`
        )
        documentVideoCapture.userStartsAndCompletesFirstPartOfCapture(copy)
        documentVideoCapture.progressSteps().isDisplayed()
        documentVideoCapture.userIsToldToSlowlyTurnDocumentToShowTheBack(copy)
        documentVideoCapture.userIsToldToKeepDocumentInFullViewAtAllTimes(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is asked to slowly turn the document around to show the back ${lang}`
        )
        userFinishesRecordingAndIsTakenToConfirmationScreen(copy)
        documentVideoConfirm.uploadAndWaitForSpinner(copy)
      })

      it('should show "Camera not working" error in ANSSI flow @percy', async () => {
        userStartsCrossDeviceFlowForIdCard(copy)
        documentVideoCapture.overlayPlaceholder().isDisplayed()
        documentVideoCapture.userIsShownCameraNotWorkingError(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown "Camera not working" error ${lang}`
        )
        documentVideoCapture.userCanDismissError()
        documentVideoCapture.cameraNotWorkingErrorIsNotSeen()
      })

      it('should show "Looks like you took too long error" in ANSSI flow @percy @longtest', async () => {
        userStartsCrossDeviceFlowForResidentPermit()
        documentVideoCapture.cardOverlay().isDisplayed()
        documentVideoCapture.startRecording(copy)
        documentVideoCapture.verifyNextStepButtonLabel(copy)
        documentVideoCapture.userIsShownLooksLikeYouTookTooLongError(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown "Looks like you took too long" error ${lang}`
        )
        documentVideoCapture.userCanStartAgain()
        documentVideoCapture.looksLikeYouTookTooLongErrorIsNotSeen()
        documentVideoCapture.startRecordingButtonIsSeen(copy)
      })

      it('should allow user to preview/retake video in ANSSI flow @percy', async () => {
        userCompletesAnssiFlowForUKResidentPermit(copy)
        documentVideoConfirm.chooseToPreviewVideo(copy)
        documentVideoPreview.checkYourVideoIsSeen(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is shown Check your video screen ${lang}`
        )
        documentVideoPreview.chooseToRetakeVideo(copy)
        documentVideoCapture.startRecordingButtonIsSeen(copy)
        await takePercySnapshotWithoutOverlay(
          driver,
          `User is taken back to the start of the flow after choosing to retake video ${lang}`
        )
      })

      it('should allow user to go back and retake video in ANSSI flow after completing the flow @percy', async () => {
        userCompletesAnssiFlowForUKResidentPermit(copy)
        documentVideoConfirm.backArrow().click()
        documentVideoCapture.startRecordingButtonIsSeen(copy)
      })
    }
  )
}
