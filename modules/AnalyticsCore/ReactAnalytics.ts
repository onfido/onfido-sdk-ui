import { Analytics } from './analytics'

export class ReactAnalytics {
  analytics = undefined

  constructor(analytics: Analytics) {
    this.analytics = analytics
  }

  trackComponent = (Component, screenName: string) => {
    this.analytics.sendScreenEvent(screenName, {})
  }
  appendToTracking = (Component, ancestorScreenNameHierarchy: string) => {
    this.analytics.sendScreenEvent(ancestorScreenNameHierarchy, {})
  }
}
