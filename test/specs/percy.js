import { describe } from '../utils/mochaw'
import { fullTestCoverageLanguages } from '../percy.json'
import { crossDeviceDocumentVideoCaptureScenarios } from './scenarios/crossDeviceDocumentVideoCapture'

describe('Percy Visual Regression Tests', () => {
  fullTestCoverageLanguages.forEach((lang) => {
    crossDeviceDocumentVideoCaptureScenarios(lang)
  })
})
