import { describe } from '../utils/mochaw'
import { asyncForEach } from '../utils/async'
import { supportedLanguages } from '../utils/config'
import { welcomeScenarios } from './scenarios/welcome'
import { documentSelectorScenarios } from './scenarios/documentSelector'
import { documentScenarios } from './scenarios/document'
import { faceScenarios } from './scenarios/face'
import { crossDeviceScenarios } from './scenarios/crossDevice'
import { proofOfAddressScenarios } from './scenarios/proofOfAddress'
import { modalScenarios } from './scenarios/modal'
import { navigationScenarios } from './scenarios/navigation'

const options = {
  screens: [
    'Camera',
    'Confirm',
    'DocumentSelector',
    'Welcome',
    'DocumentUpload',
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
  asyncForEach(supportedLanguages, (lang) => {
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
