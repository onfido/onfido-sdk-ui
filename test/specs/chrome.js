import { describe } from '../utils/mochaw'
import { supportedLanguages, fullTestCoverageLanguages } from '../config.json'
import { welcomeScenarios } from './scenarios/welcome'
import { documentSelectorScenarios } from './scenarios/documentSelector'
import { countrySelectorScenarios } from './scenarios/countrySelector'
import { documentScenarios } from './scenarios/document'
import { faceScenarios } from './scenarios/face'
import { crossDeviceScenarios } from './scenarios/crossDevice'
import { modalScenarios } from './scenarios/modal'
import { navigationScenarios } from './scenarios/navigation'
import { proofOfAddressScenarios } from './scenarios/proofOfAddress'
import { hostAppHistoryScenarios } from './scenarios/hostAppHistory'
import { accessibilityScenarios } from './scenarios/accessibility'

describe('Happy Paths on Chrome', () => {
  // Multiple language scenarios
  fullTestCoverageLanguages.forEach((lang) => {
    if (lang !== 'en_US') {
      return
    }
    welcomeScenarios(lang)
    documentSelectorScenarios(lang)
    countrySelectorScenarios(lang)
    documentScenarios(lang)
    faceScenarios(lang)
    crossDeviceScenarios(lang)
    modalScenarios(lang)
    navigationScenarios(lang)
  })
  // Note: The SDK works also with language tags that do not include region (e.g. 'en', 'es')
  // We are passing the region here so we can fetch the right json file path (e.g. `en_US/en_US.json`).
  supportedLanguages.forEach((lang) => {
    welcomeScenarios(lang)
  })
  // PoA is only available in en
  proofOfAddressScenarios()
  accessibilityScenarios()
  hostAppHistoryScenarios()
})
