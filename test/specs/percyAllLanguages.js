import { describe } from '../utils/mochaw'
import { fullTestCoverageLanguages } from '../percyAllLanguages.json'
import { faceScenarios } from './scenarios/face'
import { proofOfAddressScenarios } from './scenarios/proofOfAddress'
import { crossDeviceDocumentVideoCaptureScenarios } from './scenarios/crossDeviceDocumentVideoCapture'

describe('Percy Visual Regression Tests - All Languages', () => {
  fullTestCoverageLanguages.forEach((lang) => {
    faceScenarios(lang)
    crossDeviceDocumentVideoCaptureScenarios(lang)
  })
  proofOfAddressScenarios()
})
