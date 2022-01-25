import { describe } from '../utils/mochaw'
import { fullTestCoverageLanguages } from '../percyAllLanguages.json'
import { crossDeviceDocumentVideoCaptureScenarios } from './scenarios/crossDeviceDocumentVideoCapture'

describe('Percy Visual Regression Tests - All Languages', () => {
  fullTestCoverageLanguages.forEach((lang) => {
    crossDeviceDocumentVideoCaptureScenarios(lang)
  })
})
