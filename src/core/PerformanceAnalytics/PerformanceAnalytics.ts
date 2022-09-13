import { sendAnalytics } from '~utils/onfidoApi'
import { PerformanceEventNames } from './types'
import { NavigationCompleted, NavigationStarted } from './events/Navigation'

type PerformanceEventTypes = NavigationStarted | NavigationCompleted

export class PerformanceAnalytics {
  private eventsMap: Record<PerformanceEventNames, PerformanceEventTypes> = {}

  public trackStart(startEvent: PerformanceEventTypes) {
    this.eventsMap[startEvent.eventName] = startEvent
  }

  public trackEnd(endEvent: PerformanceEventTypes) {
    const startEvent = this.eventsMap[endEvent.eventName]

    if (!startEvent) {
      return
    }

    const duration = endEvent.time - startEvent.time
    const data = {
      event: endEvent.eventName,
      duration,
      properties: {
        ...startEvent.getProperties(),
        ...endEvent.getProperties(),
        duration,
      },
    }

    // TODO: Merge previous PR
    // TODO: Get payload content right according to api docs
    const payload = {}
    // const payload = createAnalyticsPayload({
    //   event: 'PERFORMANCE',
    //   properties: {
    //     proper
    //   }
    // })

    // TODO: Get payload, token from Redux store
    // sendAnalytics(url, payload, token)
  }

  // TODO: Create trigger for this, on page background/sdk teardown/on complete(?)
  public clearEvents() {
    this.eventsMap = {}
  }
}
