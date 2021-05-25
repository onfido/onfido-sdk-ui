import { describe } from '../utils/mochaw'
import { supportedLanguages, fullTestCoverageLanguages } from '../percy.json'
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
import { userConsentScenarios } from './scenarios/userConsent'

describe('Percy Visual Regression Tests', () => {
  fullTestCoverageLanguages.forEach((lang) => {
    welcomeScenarios(lang)
    documentSelectorScenarios(lang)
    documentScenarios(lang)
    faceScenarios(lang)
  })
  proofOfAddressScenarios()
})
