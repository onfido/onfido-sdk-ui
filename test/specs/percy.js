import { describe } from '../utils/mochaw'
import { fullTestCoverageLanguages } from '../percy.json'
import { faceScenarios } from './scenarios/face'
import { crossDeviceDocumentVideoCaptureScenarios } from './scenarios/crossDeviceDocumentVideoCapture'

describe('Percy Visual Regression Tests', () => {
  fullTestCoverageLanguages.forEach((lang) => {
    faceScenarios(lang)
    crossDeviceDocumentVideoCaptureScenarios(lang)
  })
})
