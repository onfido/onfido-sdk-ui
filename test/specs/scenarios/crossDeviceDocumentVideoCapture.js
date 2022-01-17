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
