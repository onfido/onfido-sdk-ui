import { describe } from '../utils/mochaw'
import { fullTestCoverageLanguages } from '../prode2elocal.json'
import { faceScenarios } from './scenarios/face'
import { crossDeviceScenarios } from './scenarios/crossDevice'

describe('End to End Tests against Latest Surge', () => {
  fullTestCoverageLanguages.forEach((lang) => {
    faceScenarios(lang)
    crossDeviceScenarios(lang)
  })
})
