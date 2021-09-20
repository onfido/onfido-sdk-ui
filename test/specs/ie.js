import { describe } from '../utils/mochaw'
import {
  partialTestCoverageLanguages,
  fullTestCoverageLanguages,
} from '../configie.json'
import { welcomeScenarios } from './scenarios/welcome'
import { documentSelectorScenarios } from './scenarios/documentSelector'
import { countrySelectorScenarios } from './scenarios/countrySelector'
import { documentScenarios } from './scenarios/document'
import { faceScenarios } from './scenarios/face'
import { crossDeviceScenarios } from './scenarios/crossDevice'
import { crossDeviceDocumentVideoCaptureScenarios } from './scenarios/crossDeviceDocumentVideoCapture'
import { modalScenarios } from './scenarios/modal'
import { navigationScenarios } from './scenarios/navigation'
import { proofOfAddressScenarios } from './scenarios/proofOfAddress'
import { hostAppHistoryScenarios } from './scenarios/hostAppHistory'
import { accessibilityScenarios } from './scenarios/accessibility'
import { userConsentScenarios } from './scenarios/userConsent'

describe('Happy Paths on IE', () => {
  // Multiple language scenarios
  fullTestCoverageLanguages.forEach((lang) => {
    //welcomeScenarios(lang) //All ok
    //documentSelectorScenarios(lang) //all ok
    //countrySelectorScenarios(lang) //all ok
    //documentScenarios(lang) //6 tests fail on IE
    //faceScenarios(lang) //Being sent to the Get Secure link screen
    crossDeviceScenarios(lang) //Being sent to the Get Secure link screen
    //crossDeviceDocumentVideoCaptureScenarios(lang) //Camera needed?
    //modalScenarios(lang) //all ok
    //navigationScenarios(lang) //Being sent to the Get Secure link screen
  })
  // Note: The SDK works also with language tags that do not include region (e.g. 'en', 'es')
  // We are passing the region here so we can fetch the right json file path (e.g. `en_US/en_US.json`).
  partialTestCoverageLanguages.forEach((lang) => {
    //welcomeScenarios(lang) //all ok
  })
  // PoA is only available in en
  //proofOfAddressScenarios() //last 6 fail on IE
  //accessibilityScenarios() //TODO: not run
  //hostAppHistoryScenarios() //Being sent to the Get Secure link screen
  //userConsentScenarios() //all are OK
})
