import { AnalyticsInterface } from './AnalyticsInterface.base'

export class Analytics extends AnalyticsInterface {
  sendEvent = (eventName: string, properties: Record<string, unknown>) => {
    this.dispatch({
      eventName,
      properties,
    })
  }

  sendScreenEvent = (
    screenName: string,
    properties: Record<string, unknown>
  ) => {
    this.dispatch({
      screenName,
      properties,
    })
  }
}
