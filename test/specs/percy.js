import { describe } from '../utils/mochaw'
import { fullTestCoverageLanguages } from '../percy.json'
import { documentSelectorScenarios } from './scenarios/documentSelector'
import { documentScenarios } from './scenarios/document'
import { faceScenarios } from './scenarios/face'
import { proofOfAddressScenarios } from './scenarios/proofOfAddress'
import { crossDeviceDocumentVideoCaptureScenarios } from './scenarios/crossDeviceDocumentVideoCapture'

describe('Percy Visual Regression Tests', () => {
  fullTestCoverageLanguages.forEach((lang) => {
    documentSelectorScenarios(lang)
    documentScenarios(lang)
    faceScenarios(lang)
    crossDeviceDocumentVideoCaptureScenarios(lang)
  })
  proofOfAddressScenarios()
})
