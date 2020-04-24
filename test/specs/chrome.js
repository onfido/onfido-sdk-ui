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
import { accessibilityScenarios } from './scenarios/accessibility'


describe('Happy Paths on Chrome',() => {
  // Multiple language scenarios
  supportedLanguages.forEach((lang) => {
    welcomeScenarios(lang)
    documentSelectorScenarios(lang)
    documentScenarios(lang)
    faceScenarios(lang)
    crossDeviceScenarios(lang)
    modalScenarios(lang)
    navigationScenarios(lang)
  });
  // The SDK should run also with language tags that do not include region
  ['en_US', 'es_ES', 'de_DE'].forEach((lang) => {
    welcomeScenarios(lang)
  })
  // PoA is only available in en
  proofOfAddressScenarios()
  accessibilityScenarios()
})
