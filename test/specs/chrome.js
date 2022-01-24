import { describe } from '../utils/mochaw'
import {
  partialTestCoverageLanguages,
  fullTestCoverageLanguages,
} from '../config.json'
import { faceScenarios } from './scenarios/face'
import { crossDeviceScenarios } from './scenarios/crossDevice'
import { crossDeviceDocumentVideoCaptureScenarios } from './scenarios/crossDeviceDocumentVideoCapture'
import { hostAppHistoryScenarios } from './scenarios/hostAppHistory'

describe('Happy Paths on Chrome', () => {
  // Multiple language scenarios
  fullTestCoverageLanguages.forEach((lang) => {
    faceScenarios(lang)
    crossDeviceScenarios(lang)
    crossDeviceDocumentVideoCaptureScenarios(lang)
  })
  // Note: The SDK works also with language tags that do not include region (e.g. 'en', 'es')
  // We are passing the region here so we can fetch the right json file path (e.g. `en_US/en_US.json`).
  partialTestCoverageLanguages.forEach((lang) => {})
  // PoA is only available in en

  hostAppHistoryScenarios()
})
