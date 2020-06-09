import { describe } from '../utils/mochaw'
import { regions } from '../config.json'
import { regionsScenarios } from './scenarios/regions'

describe('Happy Paths on Chrome',() => {
  // Multiple language scenarios
  regions.forEach((regions) => {
    regionsScenarios(regions)
  });
})
