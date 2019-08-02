import { describe } from '../utils/mochaw'
import { welcomeScenarios } from './scenarios/welcome'
import { documentSelectorScenarios } from './scenarios/documentSelector'
import { documentScenarios } from './scenarios/document'
import { faceScenarios } from './scenarios/face'
import { crossDeviceScenarios } from './scenarios/crossDevice'
import { proofOfAddressScenarios } from './scenarios/proofOfAddress'
import { modalScenarios } from './scenarios/modal'
import { navigationScenarios } from './scenarios/navigation'

const supportedLanguage = ["en", "es"]

const options = {
  screens: [
    'DocumentSelector',
    'Welcome',
    'DocumentUpload',
    'DocumentUploadConfirmation',
    'VerificationComplete',
    'CrossDeviceIntro',
    'CrossDeviceLink',
    'CrossDeviceMobileNotificationSent',
    'CrossDeviceMobileConnected',
    'CrossDeviceClientSuccess',
    'CrossDeviceSubmit',
    'PoaIntro',
    'PoaDocumentSelection',
    'PoaGuidance',
    'Common',
    'CameraPermissions',
    'LivenessIntro'
  ]
}

describe('Happy Paths', options, ({driver, screens}) => {
  supportedLanguage.forEach((lang) => {
    welcomeScenarios(driver, screens, lang)
    documentSelectorScenarios(driver, screens, lang)
    documentScenarios(driver, screens, lang)
    faceScenarios(driver, screens, lang)
    crossDeviceScenarios(driver, screens, lang)
    proofOfAddressScenarios(driver, screens, lang)
    modalScenarios(driver, screens, lang)
    navigationScenarios(driver, screens, lang)
  })
})
