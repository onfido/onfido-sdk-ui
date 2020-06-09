import { describe } from '../utils/mochaw'
import { regions } from '../config.json'
import { regionsScenarios } from './scenarios/regions'

describe('Happy Paths on Chrome',() => {
  regions.forEach((regions) => {
    regionsScenarios(regions)
  });
})
