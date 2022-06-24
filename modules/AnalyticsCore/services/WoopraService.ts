import { AnalyticsService } from './AnalyticsService.base'
import WoopraTracker from './safeWoopra'

export class WoopraService extends AnalyticsService {
  options = {
    url: 'http://woopra',
  }

  dispatch = (data) => {
    this.dispatchToNetwork(data)
  }

  install = () => {

  }
}
