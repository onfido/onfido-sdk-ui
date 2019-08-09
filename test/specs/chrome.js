import { describe } from '../utils/mochaw'
import { supportedLanguages } from '../config.json'
import { welcomeScenarios } from './scenarios/welcome'
import { documentSelectorScenarios } from './scenarios/documentSelector'
import { documentScenarios } from './scenarios/document'
import { faceScenarios } from './scenarios/face'
import { crossDeviceScenarios } from './scenarios/crossDevice'
import { proofOfAddressScenarios } from './scenarios/proofOfAddress'
import { modalScenarios } from './scenarios/modal'
import { navigationScenarios } from './scenarios/navigation'

describe('Happy Paths',() => {
  // Multple language scenarios
  supportedLanguages.forEach((lang) => {
    welcomeScenarios(lang)
    documentSelectorScenarios(lang)
    documentScenarios(lang)
    faceScenarios(lang)
    crossDeviceScenarios(lang)
    modalScenarios(lang)
    navigationScenarios(lang)
  })
  // PoA is only available in en
  proofOfAddressScenarios()
})
