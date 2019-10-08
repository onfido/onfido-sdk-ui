import { describe, it } from '../../utils/mochaw'
import { localhostUrl } from '../../config.json'
import { goToPassportUploadScreen, uploadFileAndClickConfirmButton } from './sharedFlows.js'
import { runAccessibilityTest } from '../../utils/accessibility'

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
    'Camera',
    'LivenessIntro',
    'PoaDocumentSelection',
    'PoaGuidance',
    'PoaIntro',
    'VerificationComplete',
    'BasePage'
  ]
}

export const accessibilityScenarios = async(lang='en') => {

  describe(`ACCESSIBILITY scenarios in ${lang}`, options, ({driver, pageObjects}) => {

    const {
      welcome,
      confirm,
      documentSelector,
      documentUpload,
      crossDeviceIntro,
      livenessIntro,
      poaDocumentSelection,
      poaIntro,
      basePage
    } = pageObjects

    const copy = basePage.copy(lang)

    const goToPoADocumentSelectionScreen = async () => {
      driver.get(localhostUrl + `?poa=true&async=false&useWebcam=false`)
      welcome.primaryBtn.click()
      poaIntro.clickStartVerificationButton()
    }

    const goToCrossDeviceScreen = async () => {
      welcome.primaryBtn.click()
      documentSelector.passportIcon.click()
      documentUpload.crossDeviceIcon.click()
      crossDeviceIntro.continueButton.click()
    }
    
    //Welcome
    it('should verify accessibility for the welcome screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      runAccessibilityTest(driver)
    })

    it('should verify focus management for the welcome screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.verifyFocusManagement()
    })

    //Cross Device Sync
    it('should verify accessibility for the cross device intro screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      documentSelector.passportIcon.click()
      documentUpload.crossDeviceIcon.click()
      runAccessibilityTest(driver)
    })

    it('should verify accessibility for the cross device screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      goToCrossDeviceScreen()
      runAccessibilityTest(driver)
    })

    // Document Selector
    it('should verify accessibility for the document selector screen', async () => {
      driver.get(localhostUrl + `?language=${lang}`)
      welcome.primaryBtn.click()
      runAccessibilityTest(driver)
    })

    //Document Upload
    it('should verify accessibility for the uploader screen', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)
      runAccessibilityTest(driver)
    })

    //FIXME: This is commented out due to the accessibility violations we need to fix.
    // it('should verify accessibility for the document upload confirmation screen', async () => {
    //   goToPassportUploadScreen(driver, welcome, documentSelector, `?language=${lang}`)
  
    //   documentUpload.getUploadInput()
    //   documentUpload.upload('passport.jpg')
    //   runAccessibilityTest(driver)
    // })

    //Face
    it('should verify accessibility for the take a selfie screen', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&async=false`)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      runAccessibilityTest(driver)
    })
  
    //FIXME: This is commented out due to the accessibility violations we need to fix.
    // it('should verify accessibility for the selfie confirmation screen', async () => {
    //   goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&async=false`)
    //   uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
    //   camera.takeSelfie()
    //   confirm.waitForElementToBeLocated(confirm.confirmBtnSelector)
    //   runAccessibilityTest(driver)
    // })
  
    it('should verify accessibility for liveness intro screen', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      runAccessibilityTest(driver)
    })

    it('should verify accessibility for camera permission screen', async () => {
      goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&liveness=true`)
      driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
      livenessIntro.clickOnContinueButton()
      runAccessibilityTest(driver)
    })

    //FIXME: This is commented out due to the accessibility violations we need to fix.
    // it('should verify accessibility for liveness recording and liveness confirmation screens', async () => {
    //   goToPassportUploadScreen(driver, welcome, documentSelector,`?language=${lang}&liveness=true`)
    //   driver.executeScript('window.navigator.mediaDevices.enumerateDevices = () => Promise.resolve([{ kind: "video" }])')
    //   uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
    //   livenessIntro.verifyUIElementsOnTheLivenessIntroScreen(copy)
    //   livenessIntro.clickOnContinueButton()
    //   camera.startVideoRecording()
    //   runAccessibilityTest(driver)
    //   camera.completeChallenges()
    //   runAccessibilityTest(driver)
    // })

    //Verification complete
    it('should verify accessibility for verification complete screen', async () => {
      driver.get(localhostUrl + `?language=${lang}&oneDoc=true&async=false&useWebcam=false`)
      welcome.primaryBtn.click(copy)
      documentUpload.verifyPassportTitle(copy)
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'passport.jpg')
      uploadFileAndClickConfirmButton(documentUpload, confirm, 'face.jpeg')
      runAccessibilityTest(driver)
    })

    //PoA
    it('should verify accessibility for PoA Intro screen', async () => {
      driver.get(localhostUrl + `?poa=true`)
      welcome.primaryBtn.click()
      runAccessibilityTest(driver)
    })

    it('should verify accessibility for PoA Document Selection screen', async () => {
      goToPoADocumentSelectionScreen()
      runAccessibilityTest(driver)
    })

    it('should verify accessibility for PoA Document Guidance screen', async () => {
      goToPoADocumentSelectionScreen()
      poaDocumentSelection.clickOnBenefitsLetterIcon()
      runAccessibilityTest(driver)
    })

    //Modal
    it('should verify accessibility for modal screen', async () => {
      driver.get(localhostUrl + `?language=${lang}&useModal=true`)
      welcome.clickOnOpenModalButton()
      runAccessibilityTest(driver)
    })
  })
}
