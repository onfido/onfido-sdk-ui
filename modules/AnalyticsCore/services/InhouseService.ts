import { AnalyticsService } from './AnalyticsService.base'

export class InhouseService extends AnalyticsService {
  options = {
    url: 'http://inhouse',
  }

  dispatch = (data) => {
    this.dispatchToNetwork(data)
  }
}