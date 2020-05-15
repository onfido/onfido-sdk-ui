import { describe } from '../utils/mochaw'
import { fullTestCoverageLanguages } from '../config.json'
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
  fullTestCoverageLanguages.forEach((lang) => {
    welcomeScenarios(lang)
    documentSelectorScenarios(lang)
    documentScenarios(lang)
    faceScenarios(lang)
    crossDeviceScenarios(lang)
    modalScenarios(lang)
    navigationScenarios(lang)
  });
  // Note: The SDK works also with language tags that do not include region (e.g. 'en', 'es')
  // We are passing the region here so we can fetch the right json file path (e.g. `en_US/en_US.json`).
  // PoA is only available in en
  proofOfAddressScenarios()
  accessibilityScenarios()
})
